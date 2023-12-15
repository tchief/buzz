import gsap from "gsap";
import { Game } from "./types.ts";
import { Signal } from "@preact/signals";

export const buildGif = async (game: Signal<Game>) => {
  //"+0+0+0+0+0+0+0+0-2-2-2-2-2-2-2+4+6+6+8+8+8-10-10-10-10-10-12-12-12-12-12-12+14+14-14-14-14+14+16+16-16-16-16-16";
  const { size, path } = game.value;
  const columns = game.value.size;
  const rows = game.value.size;
  const total = size * size;

  const getColors = (path: string, i: number, j: number) => {
    const index = 2 * (i * size + j);
    const increments = [...path.matchAll(new RegExp(`\\+${index}`, "g"))].length;
    const decrements = [...path.matchAll(new RegExp(`\\-${index}`, "g"))].length;
    const color1 = increments / total;
    const color2 = decrements / total;
    const sum = Math.round(356 * (color1 + color2)) % 356;
    return [`#85ffbd`, `hsl(${sum} 30% 40%)`];
  };

  const svg = document.querySelector("svg");
  if (!svg) return;

  const svgns = "http://www.w3.org/2000/svg";
  const width = 120;
  const height = 120;
  let counter = 0;
  const svgWidth = width * columns;
  const svgHeight = height * rows;

  gsap.set(svg, {
    attr: {
      width: svgWidth,
      height: svgHeight,
      viewBox: "0 0 " + svgWidth + " " + svgHeight,
    },
  });
  const tl = gsap.timeline({ paused: false });
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      counter++;
      const rect = document.createElementNS(svgns, "rect");
      const c = getColors(path, i, j);
      const attr = {
        x: i * width,
        y: j * height,
        width: width,
        height: height,
      };
      const toAttr = {
        duration: 4,
        yoyo: true,
        repeat: 1,
        ease: "power2.easeInOut",
      };
      tl.add(gsap.set(rect, { attr }), 0);
      tl.add(gsap.fromTo(rect, { attr: { fill: c[0] } }, { attr: { ...toAttr, fill: c[1] } }), 0);
      svg.appendChild(rect);
    }
  }
  // tl.start();
  await process(tl);
  return tl;
};

const process = async (animation: any) => {
  const gifWorker = await fetch("https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js");
  const gifWorkerBlob = await gifWorker.blob();
  const svg = document.querySelector("#svg");
  const gif = document.querySelector("#gif");
  if (!svg || !gif || !animation || !gifWorkerBlob) return;

  const fps = 25;
  const duration = animation.duration();
  const frames = Math.ceil(duration / 1 * fps);
  let current = 0;
  let queued = 0;
  const images: any[] = [];

  processImage();

  function processImage() {
    animation.progress(current++ / frames);

    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const img = new Image();
    images.push(img);

    img.crossOrigin = "Anonymous";
    img.onload = function () {
      if (++queued === frames) {
        encode();
      }
    };

    img.src = URL.createObjectURL(blob);

    if (current <= frames) {
      processImage();
    }
  }

  function encode() {
    animation.play(0);

    // @ts-ignore script
    const gif = new GIF({
      workers: 5,
      quality: 1,
      width: 350,
      height: 350,
      workerScript: URL.createObjectURL(gifWorkerBlob),
    });

    images.forEach(function (image, i) {
      gif.addFrame(image, {
        delay: 16.66,
        copy: true,
      });
    });

    // gif.on("progress", function (p) {
    //   console.log(Math.round(p * 100) + "%");
    // });

    gif.on("finished", function (blob) {
      gif.src = URL.createObjectURL(blob);
      animation.progress(1).pause();
    });

    gif.render();
  }
};

const share = (blob: Blob) => {
  const file = new File([blob], "buzz.gif", { type: "image/gif" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share(
      {
        text: "My Buzz!",
        files: [file],
        title: "Buzz",
        url: "https://buzz.deno.dev",
      } as ShareData,
    );
  }
};
