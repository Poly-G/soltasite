import Image from "next/image";
import { DemoAction } from "./demo-action";
import styles from "./reel-demo.module.css";

type ReelDemoProps = {
  variant: "maya" | "devon";
  id?: string;
};

export function ReelDemo({ variant, id }: ReelDemoProps) {
  const isMaya = variant === "maya";

  return (
    <div
      className={`${styles.reel} ${isMaya ? styles.maya : styles.devon}`}
      id={id}
      aria-label={`${isMaya ? "Maya Ortiz" : "Devon Hale"} example reel`}
    >
      <Image
        src={`/assets/img/${isMaya ? "maya-2" : "devon-5"}.jpg`}
        alt=""
        width={isMaya ? 1800 : 1350}
        height={isMaya ? 1200 : 1800}
        sizes={isMaya ? "(max-width: 860px) calc(100vw - 40px), calc(100vw - 496px)" : "100vw"}
        className={styles.poster}
      />
      <div className={styles.shade} aria-hidden="true" />
      {!isMaya ? <h2 className={styles.word}>Reel</h2> : null}
      <DemoAction
        className={styles.play}
        title="An example reel"
        message="This is an example site, so there's no reel behind the button. On yours, this is where your reel plays."
      >
        <span aria-hidden="true">▶</span>
        <span className="sr-only">
          Play {isMaya ? "Maya’s" : "Devon’s"} example reel
        </span>
      </DemoAction>
      <div className={styles.caption}>
        {isMaya
          ? "Roommates Anonymous · S1 · 0:00 / 1:05"
          : "Drama reel · 1:42 · Night Shift, Paper Boats, The Tenant"}
      </div>
      <div className={styles.progress} aria-hidden="true" />
    </div>
  );
}
