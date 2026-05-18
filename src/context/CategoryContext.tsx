import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchCategories = async () => {
    if (isFetching) return;
    
    setIsFetching(true);
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      setCategories(data || []);
      setError(null);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching categories:', err);
        setError("Gagal mengambil data kategori.");
        
        // Set dummy data jika gagal fetch
        setCategories([
          { id: '1', name: 'Umbi', description: 'Sayuran umbi-umbian' },
          { id: '2', name: 'Daun', description: 'Sayuran berdaun hijau' },
          { id: '3', name: 'Buah', description: 'Sayuran buah' },
          { id: '4', name: 'Bunga', description: 'Sayuran bunga' },
          { id: '5', name: 'Batang', description: 'Sayuran batang' },
          { id: '6', name: 'Polong', description: 'Sayuran polong' },
        ]);
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      // Generate slug from name
      const slug = category.name.toLowerCase().replace(/\s+/g, '-');
      
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{ ...category, slug }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCategories(prev => [...prev, data]);
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Gagal menambah kategori.");
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      // Generate slug if name is being updated
      const updateData = category.name 
        ? { ...category, slug: category.name.toLowerCase().replace(/\s+/g, '-') }
        : category;
      
      const { data, error } = await supabase
        .from('product_categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCategories(prev => prev.map(c => c.id === id ? data : c));
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Gagal merubah kategori.");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Gagal menghapus kategori.");
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        fetchCategories();
      }
    };
    
    const timer = setTimeout(loadData, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <CategoryContext.Provider value={{ 
      categories, 
      loading, 
      error, 
      fetchCategories, 
      addCategory, 
      updateCategory, 
      deleteCategory 
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategories must be used within CategoryProvider");
  return context;
};
