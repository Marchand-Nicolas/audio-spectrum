import config from "../utils/config";
import styles from "../styles/components/share.module.css";
import { useEffect, useState } from "react";
import copyToClipBoard from "../utils/copyToClipBoard";
import { useSearchParams } from "next/navigation";

export default function Share({
  setMenu,
  file,
}: {
  setMenu: (menu: React.ReactNode) => void;
  file: File | null;
}) {
  const [shareLink, setShareLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const customFileName = searchParams.get("file");

  useEffect(() => {
    if (customFileName) setShareLink(window.location.href);
  }, [customFileName]);

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={styles.close}
          onClick={() => setMenu(null)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
        <div className={styles.content}>
          <h1>Partager ce morceau</h1>
          {loading ? (
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : !shareLink ? (
            <button
              onClick={async () => {
                setLoading(true);
                if (!file) return;
                const data = new FormData();
                data.append("file", file);
                fetch(config.apiURL + "/post/share", {
                  method: "POST",
                  body: data,
                }).then(async (res) => {
                  setLoading(false);
                  const json = await res.json();
                  if (json.error) return console.error(json.error);
                  if (json.result)
                    setShareLink(`${window.location}?file=${json.name}`);
                });
              }}
              className="button"
            >
              Générer un lien
            </button>
          ) : null}
          {shareLink ? (
            <div className="flex mt-5">
              <input
                title="Share link"
                type="text"
                value={shareLink}
                readOnly
                className={styles.shareLink}
              />
              <button
                className={styles.copyButton}
                onClick={() => copyToClipBoard(shareLink)}
              >
                Copier
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
