import { toSvg } from "jdenticon";

export const generateProjectLogoIdenticon = (projectName: string, size: number = 100) => {
    const svgString = toSvg(projectName, size);
    const base64Svg = `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;

    return base64Svg;

};

export const defaultProjectLogo = generateProjectLogoIdenticon("my-business");