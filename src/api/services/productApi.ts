import {
  ProductResponse,
  ProductsResponse,
  ProductType,
} from "@/api/types/productType";
const baseUrl = "https://ecommerce.routemisr.com/api/v1";
export interface ProductParams {
  page?: string;
  limit?: string;
  keyword?: string;
  category?: string;
  brand?: string;
  sort?: string;
  min?: string;
  max?: string;
  subcategory?: string;
}
async function requestProducts(search: URLSearchParams) {
  return fetch(`${baseUrl}/products?${search}`, { next: { revalidate: 60 } });
}
function paginate(
  data: ProductType[],
  params: ProductParams,
): ProductsResponse {
  const limit = Math.max(1, Math.min(50, Number(params.limit) || 40));
  const pages = Math.max(1, Math.ceil(data.length / limit));
  const page = Math.max(1, Math.min(pages, Number(params.page) || 1));
  return {
    results: data.length,
    metadata: {
      currentPage: page,
      numberOfPages: pages,
      limit,
      ...(page < pages ? { nextPage: page + 1 } : {}),
      ...(page > 1 ? { prevPage: page - 1 } : {}),
    },
    data: data.slice((page - 1) * limit, page * limit),
  };
}

async function filterCatalog(params: ProductParams): Promise<ProductsResponse> {
  const first = await requestProducts(
    new URLSearchParams({ limit: "40", page: "1" }),
  );
  if (!first.ok) throw Error("Failed to fetch products");
  const initial: ProductsResponse = await first.json();
  const all = [...initial.data];
  for (let page = 2; page <= (initial.metadata?.numberOfPages || 1); page++) {
    const r = await requestProducts(
      new URLSearchParams({ limit: "40", page: String(page) }),
    );
    if (!r.ok) throw Error("Failed to fetch products");
    all.push(...(await r.json()).data);
  }
  const categoryIds = params.category?.split(",").filter(Boolean) || [];
  const brandIds = params.brand?.split(",").filter(Boolean) || [];
  const subcategoryIds = params.subcategory?.split(",").filter(Boolean) || [];
  const keyword = params.keyword?.trim().toLowerCase();
  let data = all.filter((product) => {
    if (categoryIds.length && !categoryIds.includes(product.category?._id))
      return false;
    if (brandIds.length && !brandIds.includes(product.brand?._id))
      return false;
    if (
      subcategoryIds.length &&
      !product.subcategory?.some((item) => subcategoryIds.includes(item._id))
    )
      return false;
    const searchText = `${product.title} ${product.description} ${product.brand?.name} ${product.category?.name}`.toLowerCase();
    if (keyword && !searchText.includes(keyword)) return false;
    if (params.min && product.price < Number(params.min)) return false;
    if (params.max && product.price > Number(params.max)) return false;
    return true;
  });
  data = Array.from(new Map(data.map((p) => [p._id, p])).values());
  if (params.sort === "price") data.sort((a, b) => a.price - b.price);
  else if (params.sort === "-price") data.sort((a, b) => b.price - a.price);
  else if (params.sort === "-ratingsAverage")
    data.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
  else if (params.sort === "-createdAt")
    data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return paginate(data, params);
}
export async function getProducts(
  input: ProductParams = {},
): Promise<ProductsResponse> {
  const params: ProductParams = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      params[key as keyof ProductParams] = value;
    }
  }
  if (
    params.brand?.includes(",") ||
    params.category?.includes(",") ||
    params.subcategory
  )
    return filterCatalog(params);
  const search = new URLSearchParams();
  const apiKeys: Record<string, string> = {
    category: "category[in]",
    min: "price[gte]",
    max: "price[lte]",
  };
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "")
      search.set(apiKeys[key] || key, value);
  }
  const r = await requestProducts(search);
  if (!r.ok) {
    if (
      r.status >= 500 &&
      (params.brand ||
        params.category ||
        params.keyword ||
        params.min ||
        params.max ||
        params.sort)
    )
      return filterCatalog(params);
    throw Error("Failed to fetch products");
  }
  return r.json();
}
export async function getProduct(id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  const r = await fetch(`${baseUrl}/products/${encodeURIComponent(id)}`, {
    next: { revalidate: 60 },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw Error("Failed to fetch product");
  return r.json() as Promise<ProductResponse>;
}
