'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Package,
  Calculator,
  Menu as MenuIcon,
  Settings,
  Send
} from 'lucide-react';
import { MenuItemProgress, MenuItemWorkflow } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkflowGuideProps {
  workflows: MenuItemWorkflow[];
  onNavigateToTab: (tab: string) => void;
  onNavigateToMenu: (recipeId?: string) => void;
}

export function WorkflowGuide({ workflows, onNavigateToTab, onNavigateToMenu }: WorkflowGuideProps) {
  const { t } = useLanguage();
  const getStepIcon = (completed: boolean, current: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (current) {
      return <Circle className="w-5 h-5 text-blue-600 fill-blue-100" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getActionButton = (workflow: MenuItemWorkflow) => {
    switch (workflow.nextAction) {
      case 'add_ingredients':
        return (
          <Button size="sm" onClick={() => onNavigateToTab('ingredients')}>
            <Package className="w-4 h-4 mr-2" />
            {t('inventory.workflow.steps.ingredients')}
          </Button>
        );
      case 'calculate_cost':
        return (
          <Button size="sm" onClick={() => onNavigateToTab('recipes')}>
            <Calculator className="w-4 h-4 mr-2" />
            {t('inventory.workflow.steps.recipes')}
          </Button>
        );
      case 'configure_menu':
        return (
          <Button size="sm" onClick={() => onNavigateToMenu(workflow.recipeId)} className="bg-blue-600 hover:bg-blue-700">
            <MenuIcon className="w-4 h-4 mr-2" />
            Configure Menu
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        );
      case 'add_options':
        return (
          <Button size="sm" variant="outline" onClick={() => onNavigateToMenu(workflow.recipeId)}>
            <Settings className="w-4 h-4 mr-2" />
            Add Options
          </Button>
        );
      case 'publish':
        return (
          <Button size="sm" variant="outline" onClick={() => onNavigateToMenu(workflow.recipeId)}>
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        );
      default:
        return null;
    }
  };

  const getPriorityColor = (completionPercentage: number) => {
    if (completionPercentage < 30) return 'bg-red-100 text-red-800';
    if (completionPercentage < 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const workflowSteps = [
    { key: 'hasRecipe', label: 'Recipe Created', icon: Package },
    { key: 'hasCostCalculation', label: 'Cost Calculated', icon: Calculator },
    { key: 'hasMenuPresentation', label: 'Menu Configured', icon: MenuIcon },
    { key: 'hasOptions', label: 'Options Added', icon: Settings },
    { key: 'isPublished', label: 'Published', icon: Send }
  ];

  if (workflows.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-sm">No pending menu item workflows at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MenuIcon className="w-5 h-5" />
          <span>{t('inventory.workflow.guide.title')}</span>
        </CardTitle>
        <CardDescription>
          {t('inventory.workflow.guide.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.slice(0, 3).map((workflow) => (
          <div key={workflow.name} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {workflow.name}
                  </h4>
                  <Badge className={getPriorityColor(workflow.progress.completionPercentage)}>
                    {Math.round(workflow.progress.completionPercentage)}%
                  </Badge>
                </div>
                <div className="mb-2">
                  <Progress value={workflow.progress.completionPercentage} className="h-2" />
                </div>
                <p className="text-sm text-gray-600">{workflow.category}</p>
              </div>
              <div className="ml-4">
                {getActionButton(workflow)}
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="flex items-center space-x-1 overflow-x-auto">
              {workflowSteps.map((step, index) => {
                const isCompleted = workflow.progress[step.key as keyof MenuItemProgress];
                const isCurrent = !isCompleted && workflowSteps.slice(0, index).every(s =>
                  workflow.progress[s.key as keyof MenuItemProgress]
                );

                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center min-w-0">
                      {getStepIcon(isCompleted, isCurrent)}
                      <span className="text-xs text-gray-600 mt-1 text-center">
                        {step.label}
                      </span>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div className="w-8 h-px bg-gray-300 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Last updated: {workflow.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        ))}

        {workflows.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" onClick={() => onNavigateToTab('recipes')}>
              View All {workflows.length} Workflows
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}