"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useCrmStore } from "@/store/crmStore";
import { Deal, DealStage } from "@/types";
import { DealModal } from "./DealModal";
import { Plus, GripVertical, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES: DealStage[] = ["Lead", "Contacted", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

const STAGE_LABELS: Record<DealStage, string> = {
  "Lead": "Lid (Yangi)",
  "Contacted": "Muloqotda",
  "Proposal": "Taklif Yuborilgan",
  "Negotiation": "Muzokara",
  "Closed Won": "Yutilgan",
  "Closed Lost": "Yutqazilgan"
};

export function KanbanBoard() {
  const { deals, fetchDeals, updateDeal, addDeal } = useCrmStore();
  const [boardDeals, setBoardDeals] = useState<Deal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    setBoardDeals(deals);
  }, [deals]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStage = destination.droppableId as DealStage;
    
    // Optimistic UI update
    const newBoardDeals = Array.from(boardDeals);
    const draggedDealIndex = newBoardDeals.findIndex(d => d.id === draggableId);
    if (draggedDealIndex > -1) {
      const deal = newBoardDeals[draggedDealIndex];
      deal.stage = newStage;
      setBoardDeals(newBoardDeals);
    }
    
    // Sync to Firestore
    await updateDeal(draggableId, { stage: newStage });
  };

  const handleOpenModal = (deal?: Deal) => {
    setEditingDeal(deal || null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sotuv Voronkasi (Pipeline)</h1>
          <p className="text-sm text-gray-500 mt-1">Shartnomalarni bosqichma-bosqich o'tkazish uchun ularni suring.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" /> Shartnoma Qo'shish
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
        <DragDropContext onDragEnd={onDragEnd}>
          {STAGES.map(stage => {
            const stageDeals = boardDeals.filter(d => d.stage === stage);
            
            return (
              <div key={stage} className="flex-shrink-0 w-80 flex flex-col bg-gray-100/50 rounded-xl">
                <div className="p-4 border-b border-gray-200/50 flex justify-between items-center sticky top-0 bg-gray-100/50 backdrop-blur-sm z-10 rounded-t-xl">
                  <h3 className="font-semibold text-gray-700">{STAGE_LABELS[stage]}</h3>
                  <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{stageDeals.length}</span>
                </div>
                
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={cn(
                        "flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px] transition-colors rounded-b-xl",
                        snapshot.isDraggingOver ? "bg-indigo-50/50" : ""
                      )}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "bg-white p-4 rounded-lg shadow-sm border border-gray-200 group transition hover:border-indigo-300",
                                snapshot.isDragging ? "shadow-lg ring-2 ring-indigo-500 rotate-2 opacity-90 is-dragging" : ""
                              )}
                              onClick={() => handleOpenModal(deal)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
                                <div {...provided.dragHandleProps} className="text-gray-400 cursor-grab hover:text-gray-600 active:cursor-grabbing p-1 -m-1">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                              </div>
                              
                              {deal.customerName && (
                                <p className="text-xs text-gray-500 mb-3">{deal.customerName}</p>
                              )}
                              
                              <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-gray-100">
                                <span className="flex items-center text-emerald-600 font-semibold">
                                  <DollarSign className="w-3 h-3 mr-0.5" />
                                  {deal.value.toLocaleString()}
                                </span>
                                <span className="flex items-center text-gray-400 font-medium">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(deal.dueDate).toLocaleDateString("uz-UZ", { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      <DealModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={editingDeal}
        onSave={async (data) => {
          if (editingDeal) {
            await updateDeal(editingDeal.id, data);
            fetchDeals();
          } else {
            await addDeal(data);
            fetchDeals();
          }
        }}
      />
    </>
  );
}

