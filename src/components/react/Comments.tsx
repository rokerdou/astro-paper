import Giscus from "@giscus/react";

interface Props {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  theme?: string;
  lang?: string;
}

export default function Comments({
  repo,
  repoId,
  category,
  categoryId,
  mapping = "pathname",
  lang = "en",
}: Props) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping={mapping}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang={lang}
        loading="lazy"
      />
    </div>
  );
}
