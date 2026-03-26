"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => void;
  customer?: Customer | null;
}

export function CustomerModal({ isOpen, onClose, onSave, customer }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead" as Customer["status"],
    notes: ""
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || "",
        status: customer.status,
        notes: customer.notes || ""
      });
    } else {
      setFormData({ name: "", email: "", phone: "", company: "", status: "Lead", notes: "" });
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{customer ? "Edit Customer" : "Add New Customer"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Full Name" 
            required 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <Input 
            label="Phone Number" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />
          <Input 
            label="Company" 
            value={formData.company} 
            onChange={e => setFormData({...formData, company: e.target.value})} 
          />
          
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as Customer["status"]})}
            >
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Former">Former</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea 
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{customer ? "Save Changes" : "Add Customer"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
