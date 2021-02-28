class SVGObject {
  constructor(svgs) {
    this.svgs = svgs;
  }

  getObject(name) {
    const svg = this.svgs.getObjectByName(name);
    if (svg) {
      return svg;
    }
    return null;
  }
}

export default SVGObject;
