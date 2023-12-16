import { Game } from "../utils/types.ts";
import { computed, Signal } from "@preact/signals";
import { share } from "../utils/svg.ts";
import { DEFAULT_MASK } from "../utils/utils.ts";

export default function Header({ user, game }: { user: any; game: Signal<Game> }) {
  const label = computed(() =>
    !game.value.status ? undefined : game.value.gif ? "Download gif" : "Generating..."
  );
  const aClass =
    `border border-gray-600 inline-flex items-center h-10 px-4 rounded hover:text-[#313640] hover:bg-white`;
  return (
    <div>
      <div class={`flex items-center justify-between`}>
        <div class={`flex items-center justify-center gap-8 gap-y-2  z-20 flex-wrap text-lg`}>
          {!game.value.status && (
            <span
              className={`text-md text-gray-600  text-[#313640] select-none`}
            >
              Click on '{game.value.mask ?? DEFAULT_MASK}' to play.<br />Left click - next {game
                .value.type.slice(0, -1)}.<br />Right - previous.
            </span>
          )}
          {(game.value.status) && (
            <>
              <a
                href={game.value.gif}
                className={`text-gray-600 ${aClass} text-[#313640] bg-white select-none`}
                download={"buzz.gif"}
              >
                {label}
              </a>
              {!!navigator.canShare && game.value.gif && (
                <button
                  className={`text-gray-600 ${aClass} text-[#313640] bg-white select-none`}
                  onClick={share}
                  disabled={!game.value.gif}
                >
                  Share
                </button>
              )}
            </>
          )}
        </div>
        <div class={`flex items-center justify-center gap-8 gap-y-2  z-20 flex-wrap text-lg`}>
          {
            <a
              href={"/login"}
              className={`text-gray-600 ${aClass}`}
            >
              Login
            </a>
          }
        </div>
      </div>
    </div>
  );
}
