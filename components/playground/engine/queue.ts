/** Serial action queue. Lisn's calls run one at a time; anything the visitor does aborts what is queued. */

export class Aborted extends Error {}

export type Token = { cancelled: boolean; reason: string; step: number };

export class Queue {
  private chain: Promise<unknown> = Promise.resolve();
  private live = new Set<Token>();

  run<T>(job: (t: Token) => Promise<T>, onAbort: (t: Token) => T): Promise<T> {
    const t: Token = { cancelled: false, reason: "", step: 0 };
    this.live.add(t);
    const p = this.chain.then(async () => {
      try {
        if (t.cancelled) return onAbort(t);
        return await job(t);
      } catch (e) {
        if (e instanceof Aborted || t.cancelled) return onAbort(t);
        throw e;
      } finally {
        this.live.delete(t);
      }
    });
    this.chain = p.catch(() => undefined);
    return p;
  }

  /** Cancel the running job and everything waiting behind it. */
  abort(reason: string) {
    for (const t of this.live) {
      t.cancelled = true;
      t.reason = reason;
    }
  }

  get busy() {
    return this.live.size > 0;
  }
}

/** Throw if the job was cancelled while it was waiting on an animation. */
export function check(t: Token) {
  if (t.cancelled) throw new Aborted(t.reason);
}
