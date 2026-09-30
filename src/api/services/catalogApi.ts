import {
  BrandsResponse,
  CategoriesResponse,
  SubcategoriesResponse,
} from "@/api/types/commonTypes";

const baseUrl = "https://ecommerce.routemisr.com/api/v1";

export async function getCategories(limit = 40) {
  const response = await fetch(`${baseUrl}/categories?limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json() as Promise<CategoriesResponse>;
}

export async function getBrands(limit = 50) {
  const first = await fetch(`${baseUrl}/brands?limit=${limit}`, {
    next: { revalidate: 3600 },
  });
  if (!first.ok) throw new Error("Failed to fetch brands");
  const payload = await first.json();
  const data = [...payload.data];
  for (let page = 2; page <= (payload.metadata?.numberOfPages || 1); page++) {
    const response = await fetch(
      `${baseUrl}/brands?limit=${limit}&page=${page}`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) throw new Error("Failed to fetch brands");
    data.push(...(await response.json()).data);
  }
  return { ...payload, data } as BrandsResponse;
}

export async function getSubcategories(categoryId: string) {
  const first = await fetch(`${baseUrl}/subcategories?limit=50`, {
    next: { revalidate: 3600 },
  });
  if (!first.ok) throw new Error("Failed to fetch subcategories");
  const payload: SubcategoriesResponse & { metadata?: { numberOfPages?: number } } = await first.json();
  const all = [...payload.data];
  for (let page = 2; page <= (payload.metadata?.numberOfPages || 1); page++) {
    const response = await fetch(`${baseUrl}/subcategories?limit=50&page=${page}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch subcategories");
    const next: SubcategoriesResponse = await response.json();
    all.push(...next.data);
  }
  const data = all.filter((item) => item.category === categoryId);
  return { results: data.length, data } satisfies SubcategoriesResponse;
}
