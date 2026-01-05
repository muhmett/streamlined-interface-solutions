import { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';
import { implementationPhases, getColorClasses } from '@/data/veahealth-data';

interface ImplementationSectionProps {
  progress: Record<string, number>;
  completedTasks: string[];
  toggleTaskCompletion: (taskId: string) => void;
}

const ImplementationSection = ({ progress, completedTasks, toggleTaskCompletion }: ImplementationSectionProps) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {implementationPhases.map((phase) => {
        const phaseCC = getColorClasses(phase.color);
        const phaseProgress = progress[`phase${phase.phase}`];
        
        return (
          <div key={phase.phase} className="bg-card rounded-2xl shadow-card overflow-hidden">
            <button
              onClick={() => setExpandedCard(expandedCard === phase.phase ? null : phase.phase)}
              className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${phaseCC.bgLight} ${phaseCC.text} flex items-center justify-center font-bold text-xl`}>
                  {phase.phase}
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-left">
                  <div className="font-bold text-foreground">{phaseProgress}%</div>
                  <div className="text-xs text-muted-foreground">مكتمل</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">{phase.budget}</div>
                  <div className="text-xs text-muted-foreground">ميزانية</div>
                </div>
                <div className="w-16 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${phaseCC.bg}`}
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
                {expandedCard === phase.phase ? <ChevronUp /> : <ChevronDown />}
              </div>
            </button>
            
            {expandedCard === phase.phase && (
              <div className="p-6 pt-0 space-y-4">
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold">ROI متوقع</span>
                    <span className="text-lg font-bold text-vea-green">{phase.roi}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {phase.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className={`p-4 rounded-lg border transition-all ${
                          completedTasks.includes(task.id) 
                            ? 'bg-vea-green-light border-vea-green' 
                            : task.status === 'مكتمل' 
                              ? 'bg-vea-green-light border-vea-green'
                              : 'bg-muted/30 border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                completedTasks.includes(task.id) || task.status === 'مكتمل'
                                  ? 'bg-vea-green border-vea-green text-primary-foreground'
                                  : 'border-border hover:border-vea-green'
                              }`}
                            >
                              {(completedTasks.includes(task.id) || task.status === 'مكتمل') && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <div>
                              <p className={`font-medium ${
                                completedTasks.includes(task.id) || task.status === 'مكتمل'
                                  ? 'text-vea-green line-through'
                                  : 'text-foreground'
                              }`}>
                                {task.task}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>⏱️ {task.estimated}</span>
                                <span>👤 {task.assigned}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded text-xs font-bold ${
                            task.status === 'مكتمل' ? 'bg-vea-green-light text-vea-green' :
                            task.status === 'أولوية' ? 'bg-vea-red-light text-vea-red' :
                            task.status === 'قيد العمل' ? 'bg-vea-blue-light text-vea-blue' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {completedTasks.includes(task.id) ? 'مكتمل' : task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImplementationSection;
