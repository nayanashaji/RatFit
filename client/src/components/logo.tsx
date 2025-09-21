export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">RF</span>
      </div>
      <span className="text-xl font-bold text-foreground">RatFit</span>
    </div>
  );
}
