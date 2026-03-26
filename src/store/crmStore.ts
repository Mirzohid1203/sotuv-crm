import { create } from "zustand";
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Customer, Task, Deal } from "@/types";

interface CrmState {
  customers: Customer[];
  tasks: Task[];
  deals: Deal[];
  loading: boolean;
  
  // Actions
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  fetchDeals: () => Promise<void>;
  addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
}

export const useCrmStore = create<CrmState>((set, get) => ({
  customers: [],
  tasks: [],
  deals: [],
  loading: false,

  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const customers: Customer[] = [];
      querySnapshot.forEach((doc) => {
        customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      set({ customers });
    } catch (error) {
      console.error("Error fetching customers: ", error);
    } finally {
      set({ loading: false });
    }
  },

  addCustomer: async (customerData) => {
    try {
      set({ loading: true });
      const docRef = await addDoc(collection(db, "customers"), {
        ...customerData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      const newCustomer = { id: docRef.id, ...customerData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as unknown as Customer;
      set((state) => ({ customers: [newCustomer, ...state.customers] }));
    } catch (error) {
      console.error("Error adding customer: ", error);
    } finally {
      set({ loading: false });
    }
  },

  updateCustomer: async (id, updatedData) => {
    try {
      set({ loading: true });
      const docRef = doc(db, "customers", id);
      await updateDoc(docRef, { ...updatedData, updatedAt: Timestamp.now() });
      set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
      }));
    } catch (error) {
      console.error("Error updating customer: ", error);
    } finally {
      set({ loading: false });
    }
  },

  deleteCustomer: async (id) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "customers", id));
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting customer: ", error);
    } finally {
      set({ loading: false });
    }
  },

  // Implementation for Tasks & Deals will follow a similar pattern
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      set({ tasks });
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (taskData) => {
    try {
      set({ loading: true });
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        createdAt: Timestamp.now(),
      });
      set((state) => ({ tasks: [{ id: docRef.id, ...taskData } as unknown as Task, ...state.tasks] }));
    } catch (error) {
      console.error("Error adding task: ", error);
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (id, updatedData) => {
    try {
      set({ loading: true });
      const docRef = doc(db, "tasks", id);
      await updateDoc(docRef, { ...updatedData });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedData } : t)),
      }));
    } catch (error) {
      console.error("Error updating task: ", error);
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "tasks", id));
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting task: ", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchDeals: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, "deals"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const deals: Deal[] = [];
      querySnapshot.forEach((doc) => {
        deals.push({ id: doc.id, ...doc.data() } as Deal);
      });
      set({ deals });
    } catch (error) {
      console.error("Error fetching deals: ", error);
    } finally {
      set({ loading: false });
    }
  },

  addDeal: async (dealData) => {
    try {
      set({ loading: true });
      const docRef = await addDoc(collection(db, "deals"), {
        ...dealData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      set((state) => ({ deals: [{ id: docRef.id, ...dealData } as unknown as Deal, ...state.deals] }));
    } catch (error) {
      console.error("Error adding deal: ", error);
    } finally {
      set({ loading: false });
    }
  },

  updateDeal: async (id, updatedData) => {
    try {
      // Don't set global loading state on drag and drop to avoid flicker
      const docRef = doc(db, "deals", id);
      await updateDoc(docRef, { ...updatedData, updatedAt: Timestamp.now() });
      set((state) => ({
        deals: state.deals.map((d) => (d.id === id ? { ...d, ...updatedData } : d)),
      }));
    } catch (error) {
      console.error("Error updating deal: ", error);
    }
  },

  deleteDeal: async (id) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "deals", id));
      set((state) => ({
        deals: state.deals.filter((d) => d.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting deal: ", error);
    } finally {
      set({ loading: false });
    }
  },

}));
