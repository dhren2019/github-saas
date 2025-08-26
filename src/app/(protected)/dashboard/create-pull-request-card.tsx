'use client'
import React, { useState } from 'react'
import { api } from '@/trpc/react'
import useProject from '@/hooks/use-project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GitPullRequest, Key } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type PullRequestFormData = {
    title: string
    body: string
    head: string
    base: string
    githubToken: string
}

const CreatePullRequestCard = () => {
    const { projectId } = useProject()
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, reset, setValue, watch } = useForm<PullRequestFormData>({
        defaultValues: {
            base: 'main',
            body: '',
        }
    })

    const createPullRequest = api.project.createPullRequest.useMutation()
    const { data: branches, refetch: refetchBranches } = api.project.getBranches.useQuery({
        projectId,
        githubToken: watch('githubToken')
    }, {
        enabled: false
    })

    const onSubmit = async (data: PullRequestFormData) => {
        if (!data.githubToken) {
            toast.error('GitHub token is required to create pull requests')
            return
        }

        createPullRequest.mutate({
            projectId,
            ...data,
        }, {
            onSuccess: (pullRequest) => {
                toast.success(`Pull request created successfully: #${pullRequest.number}`)
                setOpen(false)
                reset()
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to create pull request')
            },
        })
    }

    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('githubToken', e.target.value)
        if (e.target.value) {
            refetchBranches()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border border-gray-200 p-6 hover:shadow-md">
                    <div className="flex items-center">
                        <GitPullRequest className="h-8 w-8 text-primary" />
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">
                                Create Pull Request
                            </h3>
                            <p className="text-sm text-gray-500">
                                Create a new pull request in your repository
                            </p>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create Pull Request</DialogTitle>
                    <DialogDescription>
                        Create a new pull request in your GitHub repository
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="githubToken">GitHub Token</Label>
                        <Input
                            icon={Key}
                            {...register("githubToken", { required: true })}
                            onChange={handleTokenChange}
                            placeholder="GitHub Personal Access Token (required for creating PRs)"
                            type="password"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Required for authentication. Your token needs &apos;repo&apos; scope.
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="title">Pull Request Title</Label>
                        <Input
                            {...register("title", { required: true })}
                            placeholder="Enter PR title"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="body">Description</Label>
                        <Textarea
                            {...register("body")}
                            placeholder="Enter PR description (optional)"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="head">Head Branch</Label>
                            <Select onValueChange={(value) => setValue('head', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select head branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches?.map((branch) => (
                                        <SelectItem key={branch.name} value={branch.name}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">Branch with your changes</p>
                        </div>

                        <div>
                            <Label htmlFor="base">Base Branch</Label>
                            <Select 
                                onValueChange={(value) => setValue('base', value)} 
                                defaultValue="main"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select base branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches?.map((branch) => (
                                        <SelectItem key={branch.name} value={branch.name}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">Target branch for merge</p>
                        </div>
                    </div>

                    {!branches && watch('githubToken') && (
                        <p className="text-sm text-gray-500">
                            Enter your GitHub token to load available branches
                        </p>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={createPullRequest.isPending || !branches}
                        >
                            {createPullRequest.isPending ? 'Creating...' : 'Create Pull Request'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePullRequestCard