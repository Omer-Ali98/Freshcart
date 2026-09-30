"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Stars from "../catalog/Stars";
interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  user: { _id: string; name: string } | string;
}
export default function Reviews({
  productId,
  average,
  count,
}: {
  productId: string;
  average: number;
  count: number;
}) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [notice, setNotice] = useState("");
  const q = useQuery<{ data: Review[]; metadata?: { numberOfPages: number } }>({
    queryKey: ["reviews", productId, page],
    queryFn: async () => {
      const r = await fetch(`/api/reviews?productId=${productId}&page=${page}`);
      const j = await r.json();
      if (!r.ok) throw Error(j.message || "Unable to load reviews");
      return j;
    },
  });
  const mutation = useMutation({
    mutationFn: async ({ method, id }: { method: string; id?: string }) => {
      const r = await fetch(
        `/api/reviews?productId=${productId}${id ? `&reviewId=${id}` : ""}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          ...(method !== "DELETE"
            ? { body: JSON.stringify({ review, rating }) }
            : {}),
        },
      );
      const j = await r.json();
      if (!r.ok)
        throw Error(j.message || j.errors?.[0]?.msg || "Unable to save review");
      return j;
    },
    onSuccess: () => {
      setReview("");
      setEditing("");
      setRating(5);
      setNotice("Your review has been updated.");
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (e) => setNotice(e.message),
  });
  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <h3 className="text-lg font-bold">Customer Reviews</h3>
        <strong className="mt-4 block text-4xl">{average.toFixed(1)}</strong>
        <Stars rating={average} size={20} />
        <p className="mt-2 text-sm text-gray-500">Based on {count} ratings</p>
      </div>
      <div>
        {q.isPending ? (
          <p role="status">Loading reviews...</p>
        ) : q.isError ? (
          <div role="alert">
            <p>{q.error.message}</p>
            <button className="btn mt-3" onClick={() => q.refetch()}>
              Retry
            </button>
          </div>
        ) : (
          <>
            {q.data?.data?.map((r) => (
              <article
                key={r._id}
                className="mb-5 border-b border-gray-100 pb-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong>
                    {typeof r.user === "string"
                      ? "Customer"
                      : r.user?.name || "Customer"}
                  </strong>
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="my-2">
                  <Stars rating={r.rating} />
                </div>
                <p className="text-sm leading-6 text-gray-600">{r.review}</p>
                {session?.user.id ===
                  (typeof r.user === "string" ? r.user : r.user?._id) && (
                  <div className="mt-3 flex gap-4 text-xs">
                    <button
                      className="text-green-600"
                      onClick={() => {
                        setEditing(r._id);
                        setReview(r.review);
                        setRating(r.rating);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      disabled={mutation.isPending}
                      className="text-red-500"
                      onClick={() => {
                        if (window.confirm("Delete your review?"))
                          mutation.mutate({ method: "DELETE", id: r._id });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
            {!q.data?.data?.length && (
              <p className="mb-6 text-gray-500">
                No reviews yet. Be the first to share your experience.
              </p>
            )}
            {(q.data?.metadata?.numberOfPages || 1) > 1 && (
              <div className="mb-6 flex items-center gap-3">
                <button
                  className="btn btn-outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span>{page}</span>
                <button
                  className="btn btn-outline"
                  disabled={page >= (q.data?.metadata?.numberOfPages || 1)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        {session ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setNotice("");
              mutation.mutate({
                method: editing ? "PUT" : "POST",
                id: editing,
              });
            }}
            className="rounded-xl bg-gray-50 p-5"
          >
            <h3 className="mb-4 font-bold">
              {editing ? "Edit your review" : "Write a review"}
            </h3>
            <label className="field-label" htmlFor="review-rating">
              Rating
            </label>
            <select
              id="review-rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="field mb-4"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
            <label className="field-label" htmlFor="review-text">
              Your review
            </label>
            <textarea
              id="review-text"
              className="field"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              maxLength={2000}
              rows={4}
            />
            <button disabled={mutation.isPending} className="btn mt-4">
              {mutation.isPending
                ? "Saving..."
                : editing
                  ? "Update Review"
                  : "Submit Review"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing("");
                  setReview("");
                }}
                className="ml-4 text-sm"
              >
                Cancel
              </button>
            )}
          </form>
        ) : (
          <Link
            href={`/login?callbackUrl=/products/${productId}`}
            className="text-green-600"
          >
            Sign in to write a review
          </Link>
        )}
        {notice && (
          <p role="status" className="feedback mt-4">
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}
