import styles from "@/app/styles/components/bottomPopup.module.css";

export default function BottomPopup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
