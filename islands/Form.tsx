import { computed, useSignal } from "@preact/signals";

export default function Form() {
  const phrase = useSignal("");
  const slug = useSignal("");
  const onPhraseInput = (event: any) => phrase.value = event.target.value;
  const onSlugInput = (event: any) => slug.value = event.target.value;

  const words = computed(() => [...(phrase.value.toLowerCase().match(/[\p{L}-]+/ug) ?? [])]);
  const alphabet = computed(() => [...new Set(words.value)].sort());
  const error = computed(() =>
    words.value.length !== alphabet.value.length || words.value.length !== 9 ||
    slug.value.length < 5
  );

  const room = computed(() => [...(slug.value.toLowerCase().match(/[\p{L}-]+/ug) ?? [])].join("-"));

  return (
    <>
      <div class="px-4 py-8 mx-auto ">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold">Create new buzz</h1>
          <p class="text-xl  block text-gray-700 my-8">
            Share famous quotes, song lyrics, movie titles, or anything else you can think of.
          </p>
          <div class="w-full max-w-screen-md ">
            <form class="bg-[#23d5ab] shadow-2xl rounded px-8 pt-6 pb-8 mb-4">
              <div class="mb-4">
                <label class="block text-gray-700 text-md font-bold mb-2" for="slug">
                  Slug
                </label>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="slug"
                  type="text"
                  placeholder="harry potter 3"
                  value={slug.value}
                  onInput={onSlugInput}
                />
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 text-md font-bold mb-2" for="puzzle">
                  Secret phrase
                </label>
                <textarea
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="puzzle"
                  type="text"
                  rows={5}
                  placeholder="Tomorrow is a blank canvas. Paint it with purpose."
                  value={phrase.value}
                  onInput={onPhraseInput}
                />
                {error.value === true && (
                  <p class="text-red-500 text-xs italic">
                    Please, use 9 different words for a secret phrase and slug longer than 5
                    characters.
                  </p>
                )}
                <div class="mt-4">
                  {alphabet.value.length > 0 && (
                    <p class="text-xs">
                      ALL WORDS ({alphabet.value.length}): {alphabet.value.join(" ")}
                    </p>
                  )}
                  {room.value.length > 0 && (
                    <p class="text-xs">
                      URL: https://buzz.deno.dev/{room.value}
                    </p>
                  )}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                  type="button"
                  disabled={error.value === true}
                >
                  Create
                </button>
                <a
                  class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  href="/"
                >
                  Go back
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
