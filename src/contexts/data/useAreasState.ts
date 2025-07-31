
import { useState, useEffect } from 'react';

export function useAreasState() {
  const [areas, setAreas] = useState<string[]>(() => {
    const saved = localStorage.getItem("areas");
    return saved ? JSON.parse(saved) : [
      'Downtown',
      'Industrial Area',
      'Residential Zone',
      'Commercial District',
      'Suburb North',
      'Suburb South'
    ];
  });

  useEffect(() => {
    localStorage.setItem("areas", JSON.stringify(areas));
  }, [areas]);

  const addArea = (areaName: string) => {
    if (!areas.includes(areaName)) {
      setAreas([...areas, areaName]);
    }
  };

  const removeArea = (areaName: string) => {
    setAreas(areas.filter(area => area !== areaName));
  };

  return {
    areas,
    addArea,
    removeArea
  };
}
