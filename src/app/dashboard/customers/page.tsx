"use client";

import { useEffect, useState } from "react";
import { useCrmStore } from "@/store/crmStore";
import { Customer } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CustomerModal } from "@/components/dashboard/CustomerModal";
import { Plus, Search, Edit2, Trash2, UserPlus } from "lucide-react";

export default function CustomersPage() {
  const { customers, fetchCustomers, addCustomer, updateCustomer, deleteCustomer, loading } = useCrmStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenModal = (customer?: Customer) => {
    setEditingCustomer(customer || null);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (data: Omit<Customer, "id" | "createdAt" | "updatedAt">) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, data);
    } else {
      await addCustomer(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your clients, leads, and contacts.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search customers..." 
              className="pl-9 h-9 border-gray-200 ring-0 focus:ring-0 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 w-full sm:w-auto text-right">
            Showing {filteredCustomers.length} clients
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 space-y-3">
                      <div className="p-3 bg-gray-100 rounded-full"><UserPlus className="w-6 h-6 text-gray-400" /></div>
                      <p>No customers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 text-gray-800 transition-colors">
                    <td className="px-6 py-4 font-medium">{customer.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{customer.email}</span>
                        <span className="text-gray-500 text-xs">{customer.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{customer.company || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        customer.status === "Active" ? "bg-emerald-100 text-emerald-800" :
                        customer.status === "Lead" ? "bg-amber-100 text-amber-800" :
                        customer.status === "Former" ? "bg-gray-100 text-gray-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(customer)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md hover:bg-indigo-100 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="text-rose-600 hover:text-rose-900 bg-rose-50 p-1.5 rounded-md hover:bg-rose-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />
    </div>
  );
}
