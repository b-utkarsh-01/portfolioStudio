import { GridScan } from "../../../components/GridScan";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <GridScan
        sensitivity={0.55}
        lineThickness={1}
        linesColor="#392e4e"
        gridScale={0.1}
        scanColor="#FF9FFC"
        scanOpacity={0.4}
        enablePost
        bloomIntensity={0.6}
        chromaticAberration={0.002}
        noiseIntensity={0.01}
      />
    </div>
  );
};

export default HeroBackground;
