import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const ProjectCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = React.useState({
    title: '',
    evaluation_plan: '',
    evaluation_plan_file: '',
    submission_format: '',
    submission_format_file: '',
  });

  const [files, setFiles] = React.useState({
    evaluation_plan: null,
    submission_format: null,
  });

  const processFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/process-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File processing failed');
    }

    const data = await response.json();
    return data;
  };

  const createProjectMutation = useMutation(
    (projectData) =>
      fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
        navigate(`/projects/${data.project_id}`);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: 'Failed to create project',
          variant: 'destructive',
        });
      },
    }
  );

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await processFile(file, type);
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          [`${type}`]: result.text,
          [`${type}_file`]: result.filename,
        }));
        setFiles((prev) => ({
          ...prev,
          [type]: file,
        }));
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process file',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProjectMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Research Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Title</label>
            <Input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Evaluation Plan
            </label>
            <div className="space-y-2">
              <Textarea
                required
                value={formData.evaluation_plan}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    evaluation_plan: e.target.value,
                  }))
                }
                placeholder="Enter evaluation plan or upload a file"
                rows={6}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.txt,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'evaluation_plan')}
                  className="hidden"
                  id="evaluation-plan-file"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById('evaluation-plan-file').click()
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Evaluation Plan
                </Button>
                {files.evaluation_plan && (
                  <span className="text-sm text-gray-500">
                    {files.evaluation_plan.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Submission Format
            </label>
            <div className="space-y-2">
              <Textarea
                required
                value={formData.submission_format}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    submission_format: e.target.value,
                  }))
                }
                placeholder="Enter submission format or upload a file"
                rows={6}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.txt,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'submission_format')}
                  className="hidden"
                  id="submission-format-file"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById('submission-format-file').click()
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Submission Format
                </Button>
                {files.submission_format && (
                  <span className="text-sm text-gray-500">
                    {files.submission_format.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createProjectMutation.isLoading}
        >
          {createProjectMutation.isLoading ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectCreate;