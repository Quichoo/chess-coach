import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { EveMessageData, UseEveAgentStatus } from "eve/react";
import "./CoachChat.css";

type CoachChatProps = {
  data: EveMessageData;
  status: UseEveAgentStatus;
  error: string;
  questionDisabled: boolean;
  onAskQuestion: (question: string) => Promise<boolean>;
};

function getLearnerQuestion(text: string): string | null {
  try {
    const payload: unknown = JSON.parse(text);

    if (
      typeof payload === "object" &&
      payload !== null &&
      "event" in payload &&
      payload.event === "learner.question" &&
      "question" in payload &&
      typeof payload.question === "string"
    ) {
      return payload.question;
    }
  } catch {
    // Hide messages that are not structured learner questions.
  }

  return null;
}

export default function CoachChat({
  data,
  status,
  error,
  questionDisabled,
  onAskQuestion,
}: CoachChatProps) {
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isBusy =
    submitting ||
    status === "submitted" ||
    status === "streaming" ||
    status === "resuming";

  const inputDisabled = questionDisabled || isBusy || Boolean(error);

  const visibleMessages = data.messages.flatMap((message) => {
    const rawText = message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .filter(Boolean)
      .join("\n\n");

    if (message.role === "assistant" && rawText) {
      return [
        {
          id: message.id,
          role: "assistant",
          label: "Coach",
          text: rawText,
        },
      ];
    }

    if (message.role === "user") {
      const learnerQuestion = getLearnerQuestion(rawText);

      if (learnerQuestion) {
        return [
          {
            id: message.id,
            role: "user",
            label: "You",
            text: learnerQuestion,
          },
        ];
      }
    }

    return [];
  });

  // Changes when a visible message is added or its streamed text changes.
  const conversationVersion = JSON.stringify(visibleMessages);

  useLayoutEffect(() => {
    const container = messagesRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [conversationVersion]);

  useEffect(() => {
    const container = messagesRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    let frameId: number | null = null;

    function scheduleScroll() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        container!.scrollTop = container!.scrollHeight;
        frameId = null;
      });
    }

    // Also follow layout changes, such as text wrapping or font loading.
    const observer = new ResizeObserver(scheduleScroll);

    observer.observe(content);
    observer.observe(container);
    scheduleScroll();

    return () => {
      observer.disconnect();

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || inputDisabled) return;

    setSubmitting(true);

    try {
      const answered = await onAskQuestion(trimmedQuestion);

      if (answered) {
        setQuestion("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="history coach-chat" aria-label="Chess coach">
      <h2>Chess coach</h2>

      <p className="coach-chat__status" role="status">
        {error
          ? "Coaching paused"
          : isBusy
            ? "Coach is responding…"
            : questionDisabled
              ? "Waiting for move coaching…"
              : "Ready"}
      </p>

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <div
        ref={messagesRef}
        className="coach-messages"
        tabIndex={0}
        role="region"
        aria-label="Coach conversation"
        style={{
          display: "block",
          flex: "1 1 0px",
          minHeight: 0,
          maxHeight: "none",
          overflowY: "auto",
          overflowAnchor: "none",
          scrollBehavior: "auto",
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: "flow-root",
            overflowWrap: "anywhere",
          }}
        >
          {visibleMessages.length === 0 ? (
            <p
              style={{
                margin: 0,
                padding: "24px 0",
                color: "#aab9af",
                fontSize: 15,
              }}
            >
              Play your first move, or ask a question about this opening.
            </p>
          ) : (
            visibleMessages.map((message) => (
              <article
                key={message.id}
                className={`coach-message coach-message--${message.role}`}
              >
                <strong>{message.label}</strong>

                <p className="coach-chat__message-text">{message.text}</p>
              </article>
            ))
          )}
        </div>
      </div>

      <form
        className="coach-composer"
        onSubmit={handleSubmit}
        aria-busy={isBusy}
      >
        <label className="coach-composer__label" htmlFor="coach-question">
          Ask the coach
        </label>

        <textarea
          id="coach-question"
          className="coach-composer__input"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about a move or an opening idea…"
          rows={3}
          maxLength={500}
          disabled={inputDisabled}
          aria-describedby="coach-question-help"
        />

        <div className="coach-composer__footer">
          <span id="coach-question-help" className="coach-composer__help">
            {question.length}/500
          </span>

          <button
            className="coach-composer__send"
            type="submit"
            disabled={inputDisabled || !question.trim()}
          >
            {submitting ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
}
