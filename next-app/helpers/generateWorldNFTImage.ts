import { nftsvg } from "../constants/nftsvg";

const generateWorldNFTImage = (x: number, y: number, colour: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(nftsvg, "image/svg+xml");

  const xText = svgDoc.querySelector("text:nth-of-type(1)");
  if (xText) xText.textContent = `X: ${x}`;

  const yText = svgDoc.querySelector("text:nth-of-type(2)");
  if (yText) yText.textContent = `Y: ${y}`;

  // The background rectangle is the third rectangle element in the SVG
  const backgroundRect = svgDoc.querySelector("rect:nth-of-type(3)");
  if (backgroundRect) backgroundRect.setAttribute("style", `fill: ${colour}`);

  const serializer = new XMLSerializer();
  const worldNFTImage = serializer.serializeToString(svgDoc);

  return worldNFTImage;
};

export default generateWorldNFTImage;
