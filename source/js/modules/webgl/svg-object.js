class SVGObject {
  constructor(svgs) {
    this.svgs = svgs;
  }

  getObject(name) {
    const svg = this.svgs.getObjectByName(name);
    return svg;
  }
}

export default SVGObject;
