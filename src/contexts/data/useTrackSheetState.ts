
import { useCallback, useState, useEffect } from 'react';
import { TrackSheet } from '@/types';

interface TrackSheetState {
  trackSheets: TrackSheet[];
  addTrackSheet: (trackSheetData: Omit<TrackSheet, 'id'>) => TrackSheet | null;
  updateTrackSheet: (id: string, trackSheetData: Partial<TrackSheet>) => void;
  deleteTrackSheet: (id: string) => void;
}

export function useTrackSheetState(): TrackSheetState {
  const [trackSheets, setTrackSheets] = useState<TrackSheet[]>(() => {
    const saved = localStorage.getItem("trackSheets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("trackSheets", JSON.stringify(trackSheets));
  }, [trackSheets]);

  const addTrackSheet = useCallback((trackSheetData: Omit<TrackSheet, 'id'>): TrackSheet | null => {
    try {
      const newTrackSheet: TrackSheet = {
        id: `ts-${Date.now()}`,
        name: trackSheetData.name || `Track Sheet ${new Date().toLocaleDateString()}`,
        date: trackSheetData.date,
        vehicleId: trackSheetData.vehicleId || '',
        vehicleName: trackSheetData.vehicleName || '',
        salesmanId: trackSheetData.salesmanId || '',
        salesmanName: trackSheetData.salesmanName || '',
        area: trackSheetData.area || '',
        orders: trackSheetData.orders || [],
        totalAmount: trackSheetData.totalAmount || 0,
        status: trackSheetData.status || 'pending',
        rows: trackSheetData.rows || [],
        title: trackSheetData.title,
        routeName: trackSheetData.routeName,
        notes: trackSheetData.notes,
        summary: trackSheetData.summary
      };

      setTrackSheets(prevTrackSheets => [...prevTrackSheets, newTrackSheet]);
      return newTrackSheet;
    } catch (error) {
      console.error("Error adding track sheet:", error);
      return null;
    }
  }, []);

  const updateTrackSheet = useCallback((id: string, trackSheetData: Partial<TrackSheet>) => {
    setTrackSheets(prevTrackSheets =>
      prevTrackSheets.map(trackSheet =>
        trackSheet.id === id ? { ...trackSheet, ...trackSheetData } : trackSheet
      )
    );
  }, []);

  const deleteTrackSheet = useCallback((id: string) => {
    setTrackSheets(prevTrackSheets =>
      prevTrackSheets.filter(trackSheet => trackSheet.id !== id)
    );
  }, []);

  return {
    trackSheets,
    addTrackSheet,
    updateTrackSheet,
    deleteTrackSheet,
  };
}
