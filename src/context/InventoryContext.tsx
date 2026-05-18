import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface Vegetable {
  id: string; // UUID from Supabase
  category_id?: string | null; // UUID reference to product_categories
  name: string;
  description?: string | null;
  price: number;
  unit: string; // kg, ikat, buah, pack
  stock: number;
  min_stock?: number;
  is_active: boolean;
  image_url: string;
  created_at?: string;
  updated_at?: string;
  // Legacy field for backward compatibility
  category?: string;
}

interface InventoryContextType {
  vegetables: Vegetable[];
  loading: boolean;
  error: string | null;
  fetchVegetables: () => Promise<void>;
  addVegetable: (veg: Omit<Vegetable, "id">) => Promise<void>;
  updateVegetable: (id: string, veg: Partial<Vegetable>) => Promise<void>;
  deleteVegetable: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(false); // Ubah ke false agar tidak blocking
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchVegetables = async () => {
    // Prevent concurrent fetches
    if (isFetching) return;
    
    setIsFetching(true);
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      // Transform data: add 'category' field for display (map from category_id or use default)
      const transformedData = (data || []).map(item => ({
        ...item,
        category: item.category || 'Umbi' // Default category for display
      }));

      setVegetables(transformedData);
      setError(null);
    } catch (err: any) {
      // Only log if it's not an abort error
      if (err.name !== 'AbortError') {
        console.error('Error fetching vegetables:', err);
        setError("Gagal mengambil data sayur dari database.");
        
        // Set dummy data jika gagal fetch
        setVegetables([
          {
            id: '1',
            name: 'Wortel Segar',
            description: 'Wortel organik segar dari petani lokal',
            price: 15000,
            unit: 'kg',
            stock: 50,
            min_stock: 10,
            category: 'Umbi', // For display only
            category_id: null,
            image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400',
            is_active: true
          },
          {
            id: '2',
            name: 'Bayam Hijau',
            description: 'Bayam segar kaya nutrisi',
            price: 8000,
            unit: 'ikat',
            stock: 30,
            min_stock: 5,
            category: 'Daun',
            category_id: null,
            image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400',
            is_active: true
          },
          {
            id: '3',
            name: 'Tomat Merah',
            description: 'Tomat merah segar untuk masakan',
            price: 12000,
            unit: 'kg',
            stock: 40,
            min_stock: 10,
            category: 'Buah',
            category_id: null,
            image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
            is_active: true
          },
          {
            id: '4',
            name: 'Brokoli',
            description: 'Brokoli hijau segar',
            price: 25000,
            unit: 'kg',
            stock: 20,
            min_stock: 5,
            category: 'Bunga',
            category_id: null,
            image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=400',
            is_active: true
          },
          {
            id: '5',
            name: 'Kentang',
            description: 'Kentang berkualitas tinggi',
            price: 18000,
            unit: 'kg',
            stock: 0,
            min_stock: 10,
            category: 'Umbi',
            category_id: null,
            image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400',
            is_active: true
          }
        ]);
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const addVegetable = async (veg: Omit<Vegetable, "id">) => {
    try {
      // Remove 'category' field and only send database columns
      const { category, ...dbData } = veg;
      
      const { data, error } = await supabase
        .from('products')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setVegetables(prev => [...prev, data]);
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Gagal menambah data.");
    }
  };

  const updateVegetable = async (id: string, veg: Partial<Vegetable>) => {
    try {
      // Remove 'category' field and only send database columns
      const { category, ...dbData } = veg;
      
      const { data, error } = await supabase
        .from('products')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setVegetables(prev => prev.map(v => v.id === id ? data : v));
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Gagal merubah data.");
    }
  };

  const deleteVegetable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVegetables(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Gagal menghapus data.");
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Load data in background, don't block rendering
    const loadData = async () => {
      if (mounted) {
        // Don't await, let it load in background
        fetchVegetables();
      }
    };
    
    // Use setTimeout to defer loading
    const timer = setTimeout(loadData, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <InventoryContext.Provider value={{ vegetables, loading, error, fetchVegetables, addVegetable, updateVegetable, deleteVegetable }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within InventoryProvider");
  return context;
};
