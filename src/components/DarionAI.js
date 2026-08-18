import {
  React,
  html,
} from '../lib/react.js';

const SESSION_KEY =
  'fendisha-darion-ai-session';

const POLL_MS =
  1600;

const SUGGESTIONS = [
  'what do u actually know about me? 👀',
  'did he really make all of this?',
  'what are u hiding from me 😭',
];

function getSessionId() {
  try {
    const existing =
      localStorage.getItem(
        SESSION_KEY
      );

    if (existing) {
      return existing;
    }

    const id =
      `fendisha_${
        globalThis.crypto
          ?.randomUUID?.() ||
        `${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}`
      }`
        .replace(
          /[^a-zA-Z0-9_-]/g,
          '_'
        );

    localStorage.setItem(
      SESSION_KEY,
      id
    );

    return id;
  } catch {
    return `fendisha_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
  }
}

async function apiCall(body) {
  const response =
    await fetch(
      '/api/darion-ai',
      {
        method:
          'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify(
            body
          ),
      }
    );

  const data =
    await response
      .json()
      .catch(
        () => ({})
      );

  if (!response.ok) {
    const error =
      new Error(
        data?.error ||
          'Darion AI is unavailable.'
      );

    error.status =
      response.status;

    throw error;
  }

  return data;
}

function prettyScene(
  sceneId
) {
  if (!sceneId) {
    return 'somewhere in the birthday universe';
  }

  return String(
    sceneId
  )
    .replace(
      /-/g,
      ' '
    );
}

function MessageBubble({
  side,
  children,
  waiting = false,
}) {
  const mine =
    side === 'her';

  return html`
    <div
      className=${
        mine
          ? 'flex justify-end'
          : 'flex justify-start'
      }
    >
      <div
        className=${`
          max-w-[86%]
          rounded-[1.35rem]
          px-3.5
          py-2.5
          text-[13px]
          leading-[1.55]
          shadow-sm
          ${
            mine
              ? 'rounded-br-md bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white'
              : 'rounded-bl-md border border-purple-100 bg-white/90 text-purple-950/78'
          }
        `}
      >
        ${children}

        ${
          waiting
            ? html`
                <span
                  className="ml-1 inline-flex gap-0.5 align-middle"
                  aria-label="thinking"
                >
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse [animation-delay:150ms]">.</span>
                  <span className="animate-pulse [animation-delay:300ms]">.</span>
                </span>
              `
            : null
        }
      </div>
    </div>
  `;
}

export function DarionAI({
  sceneId = 'entry-gate',
}) {
  const [
    open,
    setOpen,
  ] =
    React.useState(
      false
    );

  const [
    input,
    setInput,
  ] =
    React.useState(
      ''
    );

  const [
    messages,
    setMessages,
  ] =
    React.useState(
      []
    );

  const [
    sending,
    setSending,
  ] =
    React.useState(
      false
    );

  const [
    error,
    setError,
  ] =
    React.useState(
      ''
    );

  const [
    sessionId,
  ] =
    React.useState(
      () => getSessionId()
    );

  const scrollRef =
    React.useRef(
      null
    );

  const firstAnswerSeenRef =
    React.useRef(
      new Set()
    );

  const poll =
    React.useCallback(
      async () => {
        try {
          const data =
            await apiCall({
              action:
                'poll',
              sessionId,
            });

          const next =
            Array.isArray(
              data.messages
            )
              ? data.messages
              : [];

          setMessages(
            next
          );

          for (const item of next) {
            if (
              item.status ===
                'answered' &&
              !firstAnswerSeenRef.current.has(
                item.id
              )
            ) {
              firstAnswerSeenRef.current.add(
                item.id
              );

              if (
                document.visibilityState ===
                'visible'
              ) {
                navigator.vibrate?.(
                  [18, 35, 18]
                );
              }
            }
          }

          setError(
            ''
          );
        } catch {
          // Chat polling must never affect the birthday experience.
        }
      },
      [sessionId]
    );

  React.useEffect(
    () => {
      poll();

      const timer =
        window.setInterval(
          poll,
          POLL_MS
        );

      const onVisible =
        () => {
          if (
            document.visibilityState ===
            'visible'
          ) {
            poll();
          }
        };

      document.addEventListener(
        'visibilitychange',
        onVisible
      );

      return () => {
        clearInterval(
          timer
        );

        document.removeEventListener(
          'visibilitychange',
          onVisible
        );
      };
    },
    [poll]
  );

  React.useEffect(
    () => {
      if (
        !open ||
        !scrollRef.current
      ) {
        return;
      }

      const frame =
        requestAnimationFrame(
          () => {
            if (
              scrollRef.current
            ) {
              scrollRef.current.scrollTop =
                scrollRef.current.scrollHeight;
            }
          }
        );

      return () =>
        cancelAnimationFrame(
          frame
        );
    },
    [
      open,
      messages,
      sending,
    ]
  );

  const submit =
    async (
      forcedText = null
    ) => {
      const question =
        String(
          forcedText ??
            input
        ).trim();

      if (
        !question ||
        sending
      ) {
        return;
      }

      setInput(
        ''
      );

      setSending(
        true
      );

      setError(
        ''
      );

      const optimisticId =
        `optimistic_${Date.now()}`;

      setMessages(
        current => [
          ...current,
          {
            id:
              optimisticId,
            question,
            answer:
              null,
            status:
              'waiting',
            scene_id:
              sceneId,
            created_at:
              new Date().toISOString(),
          },
        ]
      );

      try {
        await apiCall({
          action:
            'ask',
          sessionId,
          question,
          sceneId,
        });

        await poll();
      } catch (nextError) {
        setMessages(
          current =>
            current.filter(
              item =>
                item.id !==
                optimisticId
            )
        );

        setInput(
          question
        );

        setError(
          nextError?.status ===
            429
            ? 'slow down fkr 😭 one question at a time.'
            : 'the tiny AI tripped over a cable. try again 😭'
        );
      } finally {
        setSending(
          false
        );
      }
    };

  const onKeyDown =
    event => {
      if (
        event.key ===
          'Enter' &&
        !event.shiftKey
      ) {
        event.preventDefault();
        submit();
      }
    };

  const hasConversation =
    messages.length > 0;

  return html`
    <div
      className="fixed bottom-[max(.85rem,env(safe-area-inset-bottom))] left-3 z-[7900] sm:bottom-5 sm:left-5"
    >
      <div
        className=${`
          relative
          overflow-hidden
          border
          border-white/90
          bg-[#fffafd]/95
          shadow-[0_24px_80px_rgba(74,39,95,.22)]
          backdrop-blur-2xl
          transition-[width,height,border-radius,transform,opacity]
          duration-300
          ease-out
          ${
            open
              ? 'h-[min(570px,72svh)] w-[min(390px,calc(100vw-1.5rem))] rounded-[2rem]'
              : 'h-12 w-[158px] rounded-full'
          }
        `}
      >
        ${
          !open
            ? html`
                <button
                  type="button"
                  onClick=${() => {
                    setOpen(
                      true
                    );
                    navigator.vibrate?.(
                      8
                    );
                  }}
                  className="flex h-full w-full items-center gap-2.5 px-3.5 text-left transition hover:bg-purple-50/70"
                  aria-label="Open Darion AI"
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-[11px] text-white shadow-[0_6px_18px_rgba(105,54,135,.18)]"
                  >
                    AI
                  </span>

                  <span>
                    <span
                      className="block text-[8px] font-black uppercase tracking-[.16em] text-purple-400"
                    >
                      ask
                    </span>

                    <span
                      className="block font-display text-sm font-semibold italic leading-none text-plum"
                    >
                      Darion AI
                    </span>
                  </span>

                  ${
                    messages.some(
                      item =>
                        item.status ===
                        'answered'
                    )
                      ? html`
                          <span
                            className="ml-auto h-2 w-2 rounded-full bg-pink-400 ring-2 ring-white"
                          ></span>
                        `
                      : null
                  }
                </button>
              `
            : html`
                <div
                  className="flex h-full min-h-0 flex-col"
                >
                  <header
                    className="flex shrink-0 items-start gap-3 border-b border-purple-100/80 px-4 pb-3 pt-4"
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 font-display text-sm font-bold italic text-white shadow-[0_8px_22px_rgba(105,54,135,.20)]"
                    >
                      AI
                    </span>

                    <div
                      className="min-w-0 flex-1"
                    >
                      <div
                        className="flex items-center gap-2"
                      >
                        <p
                          className="font-display text-xl font-semibold italic leading-none text-plum"
                        >
                          Darion AI
                        </p>

                        <span
                          className="rounded-full bg-purple-50 px-2 py-1 text-[7px] font-black uppercase tracking-[.14em] text-purple-400"
                        >
                          suspicious beta
                        </span>
                      </div>

                      <p
                        className="mt-1 text-[10px] leading-4 text-purple-900/50"
                      >
                        currently lurking around ${prettyScene(
                          sceneId
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick=${() =>
                        setOpen(
                          false
                        )
                      }
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-50 text-xs font-black text-purple-600 transition hover:bg-purple-100"
                      aria-label="Close Darion AI"
                    >
                      ×
                    </button>
                  </header>

                  <div
                    ref=${scrollRef}
                    className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
                  >
                    <${MessageBubble}
                      side="ai"
                    >
                      hi fkr 😭 apparently Darion gave me access to a deeply unnecessary amount of birthday information. ask carefully.
                    <//>

                    ${
                      !hasConversation
                        ? html`
                            <div
                              className="space-y-2 pt-1"
                            >
                              <p
                                className="text-[8px] font-black uppercase tracking-[.18em] text-purple-400"
                              >
                                try one
                              </p>

                              <div
                                className="flex flex-wrap gap-1.5"
                              >
                                ${SUGGESTIONS.map(
                                  suggestion => html`
                                    <button
                                      key=${suggestion}
                                      type="button"
                                      onClick=${() =>
                                        submit(
                                          suggestion
                                        )
                                      }
                                      className="rounded-full border border-purple-100 bg-white/80 px-3 py-1.5 text-[10px] font-semibold text-purple-700 transition hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50"
                                    >
                                      ${suggestion}
                                    </button>
                                  `
                                )}
                              </div>
                            </div>
                          `
                        : null
                    }

                    ${messages.map(
                      item => html`
                        <${React.Fragment}
                          key=${item.id}
                        >
                          <${MessageBubble}
                            side="her"
                          >
                            ${item.question}
                          <//>

                          ${
                            item.status ===
                              'answered' &&
                            item.answer
                              ? html`
                                  <${MessageBubble}
                                    side="ai"
                                  >
                                    ${item.answer}
                                  <//>
                                `
                              : html`
                                  <${MessageBubble}
                                    side="ai"
                                    waiting=${true}
                                  >
                                    ${
                                      Date.now() -
                                          new Date(
                                            item.created_at ||
                                              Date.now()
                                          ).getTime() >
                                        22_000
                                        ? 'this AI is taking suspiciously long with this one 😭'
                                        : 'thinking'
                                    }
                                  <//>
                                `
                          }
                        <//>
                      `
                    )}

                    ${
                      sending
                        ? html`
                            <p
                              className="text-[9px] italic text-purple-400/70"
                            >
                              delivering your question into the void…
                            </p>
                          `
                        : null
                    }
                  </div>

                  <div
                    className="shrink-0 border-t border-purple-100/80 bg-white/55 px-3 pb-[max(.65rem,env(safe-area-inset-bottom))] pt-3"
                  >
                    ${
                      error
                        ? html`
                            <p
                              className="mb-2 px-1 text-[10px] font-semibold text-pink-500"
                            >
                              ${error}
                            </p>
                          `
                        : null
                    }

                    <div
                      className="flex items-end gap-2 rounded-[1.4rem] border border-purple-100 bg-white px-3 py-2 shadow-sm focus-within:border-purple-200"
                    >
                      <textarea
                        value=${input}
                        onInput=${event =>
                          setInput(
                            event.target.value
                          )
                        }
                        onKeyDown=${onKeyDown}
                        rows="1"
                        maxLength="700"
                        placeholder="ask Darion AI something…"
                        className="max-h-24 min-h-8 flex-1 resize-none bg-transparent py-1 text-[12px] leading-5 text-plum outline-none placeholder:text-purple-300"
                      ></textarea>

                      <button
                        type="button"
                        disabled=${
                          sending ||
                          !input.trim()
                        }
                        onClick=${() =>
                          submit()
                        }
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-xs font-black text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Send question"
                      >
                        →
                      </button>
                    </div>

                    <p
                      className="mt-2 px-1 text-center text-[8px] leading-3 text-purple-900/35"
                    >
                      tiny disclosure: messages here can reach Darion 👀 some answers may be suspiciously human.
                    </p>
                  </div>
                </div>
              `
        }
      </div>
    </div>
  `;
}
