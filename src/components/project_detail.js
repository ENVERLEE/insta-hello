import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Play, FileText, Book, CheckCircle, Download } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { toast } = useToast();

  // Fetch project steps
  const { data: steps, refetch: refetchSteps } = useQuery(
    ['researchSteps', projectId],
    () => fetch(`/api/research/${projectId}/steps`).then(res => res.json())
  );

  // Fetch project progress
  const { data: progress } = useQuery(
    ['projectProgress', projectId],
    () => fetch(`/api/dashboard/projects/${projectId}/progress`).then(res => res.json())
  );

  // Execute research step mutation
  const executeStepMutation = useMutation(
    (stepNumber) =>
      fetch(`/api/research/${projectId}/step/${stepNumber}`, {
        method: 'POST',
      }).then(res => res.json()),
    {
      onSuccess: () => {
        refetchSteps();
        toast({
          title: 'Success',
          description: 'Research step completed successfully',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to execute research step',
          variant: 'destructive',
        });
      },
    }
  );

  // Finalize research mutation
  const finalizeMutation = useMutation(
    () =>
      fetch(`/api/research/${projectId}/finalize`, {
        method: 'POST',
      }).then(res => res.json()),
    {
      onSuccess: (data) => {
        toast({
          title: 'Success',
          description: 'Research finalized successfully',
        });
        // Handle the final report data
        handleDownloadReport(data.final_report);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to finalize research',
          variant: 'destructive',
        });
      },
    }
  );

  const handleDownloadReport = (reportContent) => {
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-report-${projectId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Research Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress?.progress?.percentage || 0} className="h-2" />
          <div className="mt-2 text-sm text-gray-500">
            {progress?.progress?.completed_steps || 0} of {progress?.progress?.total_steps || 0} steps completed
          </div>
        </CardContent>
      </Card>

      {/* Research Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Research Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-4">
            {steps?.steps?.map((step, index) => (
              <AccordionItem key={index} value={`step-${index}`}>
                <AccordionTrigger className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    {step.result ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Play className="w-5 h-5 text-blue-500" />
                    )}
                    <span>Step {step.step_number}: {step.description}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      Keywords
                    </h4>
                    <p className="text-sm text-gray-600">{step.keywords}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Methodology
                    </h4>
                    <p className="text-sm text-gray-600">{step.methodology}</p>
                  </div>

                  {step.result && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Results</h4>
                      <p className="text-sm text-gray-600">{step.result}</p>
                    </div>
                  )}

                  {!step.result && (
                    <Button
                      onClick={() => executeStepMutation.mutate(step.step_number)}
                      disabled={executeStepMutation.isLoading}
                    >
                      {executeStepMutation.isLoading ? 'Executing...' : 'Execute Step'}
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Finalize Research */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => finalizeMutation.mutate()}
          disabled={finalizeMutation.isLoading || !progress?.progress?.completed_steps}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {finalizeMutation.isLoading ? 'Generating Report...' : 'Generate Final Report'}
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetail;