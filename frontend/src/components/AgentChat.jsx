import { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

export default function AgentChat({ onSubmit, loading }) {
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e?.preventDefault();

    if (!message.trim() || loading) return;

    const value = message.trim();

    setMessage("");

    await onSubmit(value);
  };

  const suggestions = [
    "Should I move scooters to Majestic for the next hour?",
    "Show me the fleet risk right now",
    "Forecast demand at Indiranagar",
  ];

  return (
    <div>
      <form
        onSubmit={submit}
        className="group relative rounded-2xl border border-white/[0.09] bg-[#0c0f12] transition focus-within:border-white/[0.16]"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          rows={3}
          placeholder="Ask FleetMind what the fleet should do next..."
          className="w-full resize-none bg-transparent px-5 pb-14 pt-5 text-sm leading-6 text-[#e7ebee] outline-none placeholder:text-[#4f575e]"
        />

        <div className="absolute bottom-3 left-4 text-[9px] uppercase tracking-[0.15em] text-[#454c52]">
          Fleet operations agent
        </div>

        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowUp size={16} />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => setMessage(item)}
            className="flex items-center gap-2 rounded-full border border-white/[0.07] px-3 py-2 text-[11px] text-[#727a81] transition hover:border-white/[0.14] hover:text-[#b8bec3]"
          >
            <Sparkles size={11} />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}