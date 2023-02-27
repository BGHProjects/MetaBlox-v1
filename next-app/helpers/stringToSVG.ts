const stringToSVG = (svgString: string) => {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  return blob;
};

export default stringToSVG;
