"use client";

import { useState, useEffect } from "react";
import { Deal, Customer } from "@/types";
import { useCrmStore } from "@/store/crmStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => void;
  deal?: Deal | null;
}

export function DealModal({ isOpen, onClose, onSave, deal }: DealModalProps) {
  const { customers, fetchCustomers } = useCrmStore();
  const [formData, setFormData] = useState({
    title: "",
    value: 0,
    stage: "Lead" as Deal["stage"],
    customerId: "",
    customerName: "",
    dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, [customers.length, fetchCustomers]);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        customerId: deal.customerId || "",
        customerName: deal.customerName || "",
        dueDate: deal.dueDate
      });
    } else {
      setFormData({ title: "", value: 0, stage: "Lead", customerId: "", customerName: "", dueDate: new Date().toISOString().split('T')[0] });
    }
  }, [deal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    onSave({
      ...formData,
      customerName: customer ? customer.name : formData.customerName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{deal ? "Edit Deal" : "Add New Deal"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Deal Title" 
            required 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
          <Input 
            label="Estimated Value ($)" 
            type="number" 
            required 
            value={formData.value} 
            onChange={e => setFormData({...formData, value: parseFloat(e.target.value) || 0})} 
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Link Customer (Optional)</label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.customerId}
              onChange={e => setFormData({...formData, customerId: e.target.value})}
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Stage</label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.stage}
              onChange={e => setFormData({...formData, stage: e.target.value as Deal["stage"]})}
            >
              <option value="Lead">Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>

          <Input 
            label="Expected Close Date" 
            type="date"
            required 
            value={formData.dueDate} 
            onChange={e => setFormData({...formData, dueDate: e.target.value})} 
          />

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{deal ? "Save Changes" : "Add Deal"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
