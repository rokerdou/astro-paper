import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";

interface CommentItem {
  id: number;
  parentId: number | null;
  authorName: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface CommentsResponse {
  comments: CommentItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    lastPage: number;
  };
}

interface Props {
  slug: string;
}

interface CommentFormProps {
  parentId?: number | null;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmitted?: () => void;
}

const PAGE_SIZE = 10;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function buildThread(comments: CommentItem[]) {
  const roots: Array<CommentItem & { replies: CommentItem[] }> = [];
  const rootMap = new Map<number, CommentItem & { replies: CommentItem[] }>();

  for (const comment of comments) {
    if (comment.parentId === null) {
      const root = { ...comment, replies: [] };
      roots.push(root);
      rootMap.set(comment.id, root);
    }
  }

  for (const comment of comments) {
    if (comment.parentId !== null) {
      rootMap.get(comment.parentId)?.replies.push(comment);
    }
  }

  return roots;
}

function CommentsInner({ slug }: Props) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const queryKey = ["comments", slug, page];
  const { data, isLoading, error } = useQuery<CommentsResponse>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(slug)}/comments?page=${page}&pageSize=${PAGE_SIZE}`
      );
      if (!response.ok) throw new Error("Unable to load comments");
      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: {
      authorName: string;
      authorEmail: string;
      content: string;
      parentId: number | null;
    }) => {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(slug)}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit comment");
      }
      return result;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments", slug] });
    },
  });

  const threads = useMemo(
    () => buildThread(data?.comments ?? []),
    [data?.comments]
  );
  const hasComments = threads.length > 0;

  function CommentForm({
    parentId = null,
    submitLabel = "Post comment",
    onCancel,
    onSubmitted,
  }: CommentFormProps) {
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const [content, setContent] = useState("");

    async function onSubmit(event: { preventDefault: () => void }) {
      event.preventDefault();
      await submitMutation.mutateAsync({
        authorName,
        authorEmail,
        content,
        parentId,
      });
      setContent("");
      if (!parentId) {
        setAuthorName("");
        setAuthorEmail("");
      }
      onSubmitted?.();
    }

    return (
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-skin-base">
            Name
            <input
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              maxLength={80}
              required
              value={authorName}
              onChange={event => setAuthorName(event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-skin-base">
            Email
            <input
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              type="email"
              value={authorEmail}
              onChange={event => setAuthorEmail(event.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-skin-base">
          Comment
          <textarea
            className="mt-1 min-h-28 w-full resize-y rounded border border-border bg-background px-3 py-2 text-sm leading-6 outline-none focus:border-accent"
            maxLength={2000}
            minLength={2}
            required
            value={content}
            onChange={event => setContent(event.target.value)}
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitMutation.isPending}
            type="submit"
          >
            {submitMutation.isPending ? "Submitting..." : submitLabel}
          </button>
          {onCancel && (
            <button
              className="rounded px-3 py-2 text-sm text-accent hover:underline"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }

  function CommentCard({
    comment,
    replies,
  }: {
    comment: CommentItem;
    replies: CommentItem[];
  }) {
    const [replying, setReplying] = useState(false);

    return (
      <article className="rounded border border-border bg-background p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold">{comment.authorName}</h3>
          <time className="text-xs text-skin-base/70" dateTime={comment.createdAt}>
            {formatDate(comment.createdAt)}
          </time>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-skin-base">
          {comment.content}
        </p>
        <button
          className="mt-3 text-sm font-medium text-accent hover:underline"
          type="button"
          onClick={() => setReplying(value => !value)}
        >
          Reply
        </button>
        {replying && (
          <div className="mt-4 border-t border-border pt-4">
            <CommentForm
              parentId={comment.id}
              submitLabel="Post reply"
              onCancel={() => setReplying(false)}
              onSubmitted={() => setReplying(false)}
            />
          </div>
        )}
        {replies.length > 0 && (
          <div className="mt-4 space-y-3 border-l border-border pl-4">
            {replies.map(reply => (
              <article className="rounded bg-skin-card p-3" key={reply.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold">{reply.authorName}</h4>
                  <time className="text-xs text-skin-base/70" dateTime={reply.createdAt}>
                    {formatDate(reply.createdAt)}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {reply.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </article>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="comments-title">
      <div>
        <h2 id="comments-title" className="text-2xl font-semibold">
          Comments
        </h2>
        <p className="mt-1 text-sm text-skin-base/70">
          Comments are reviewed before they appear.
        </p>
      </div>

      <div className="rounded border border-border bg-skin-card p-4">
        <CommentForm />
        {submitMutation.isSuccess && (
          <p className="mt-3 text-sm text-accent">
            Thanks. Your comment is waiting for review.
          </p>
        )}
        {submitMutation.error && (
          <p className="mt-3 text-sm text-red-600">
            {(submitMutation.error as Error).message}
          </p>
        )}
      </div>

      {isLoading && <p className="text-sm text-skin-base/70">Loading comments...</p>}
      {error && (
        <p className="text-sm text-red-600">Comments could not be loaded.</p>
      )}
      {!isLoading && !hasComments && (
        <p className="rounded border border-dashed border-border px-4 py-6 text-sm text-skin-base/70">
          No approved comments yet.
        </p>
      )}
      {hasComments && (
        <div className="space-y-4">
          {threads.map(comment => (
            <CommentCard
              comment={comment}
              key={comment.id}
              replies={comment.replies}
            />
          ))}
        </div>
      )}

      {data && data.pagination.lastPage > 1 && (
        <nav className="flex items-center justify-between gap-4">
          <button
            className="rounded border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page <= 1}
            type="button"
            onClick={() => setPage(value => Math.max(1, value - 1))}
          >
            Previous
          </button>
          <span className="text-sm text-skin-base/70">
            Page {data.pagination.page} of {data.pagination.lastPage}
          </span>
          <button
            className="rounded border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page >= data.pagination.lastPage}
            type="button"
            onClick={() => setPage(value => value + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

export default function Comments(props: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <CommentsInner {...props} />
    </QueryClientProvider>
  );
}
