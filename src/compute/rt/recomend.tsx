function generate_recomend(value: number, size: number) {
  const a = Array(size).fill(value);
  return a.map((v, i) => {
    if (i === 0) {
      return v * 1.1;
    }
    if (i === 1) {
      return v * 1.05;
    }
    if (i === size - 2) {
      return v * 0.95;
    }
    if (i === size - 1) {
      return v * 0.9;
    }
    return v;
  });

}


export const rec_for_main = [
  {
    label: "Recomend",
    data: generate_recomend(0.4, 16),
    borderColor: "rgb(255,0,0)",
    backgroundColor: "rgba(255,0,0,0.5)"
  },
  {
    label: "Recomend",
    data: generate_recomend(0.6, 16),
    borderColor: "rgb(255,0,0)",
    backgroundColor: "rgba(255,0,0,0.5)"
  }];
