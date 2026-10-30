"use client";

import Link from "next/link";
import { useId, useRef, type ReactNode } from "react";
import styles from "./demo-dialog.module.css";

type DemoActionProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  message?: string;
};

export function DemoAction({
  children,
  className,
  title = "An example actor site",
  message = "This actor and agency are fictional. On your site, this button connects to your own contact details, profiles, or files.",
}: DemoActionProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <>
      <button
        type="button"
        ref={trigger}
        className={className}
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            ) {
              dialog.current?.close();
            }
          }
        }}
      >
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div id={descriptionId} className={styles.description}>
          {message}
        </div>
        <Link className={styles.link} href="/">
          See how Solta Site builds actor sites <span aria-hidden="true">→</span>
        </Link>
        <button
          type="button"
          className={styles.close}
          onClick={() => dialog.current?.close()}
          autoFocus
        >
          Close
        </button>
      </dialog>
    </>
  );
}
