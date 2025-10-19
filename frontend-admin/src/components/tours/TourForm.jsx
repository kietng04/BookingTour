import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Card from '../common/Card.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' }
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
  { value: 'archived', label: 'Archived' }
];

const defaultValues = {
  name: '',
  slug: '',
  status: 'draft',
  price: '',
  duration: '',
  seats: '',
  difficulty: 'moderate',
  heroImage: '',
  tags: [{ value: '' }],
  highlights: [{ value: '' }]
};

const TourForm = ({ onSubmit, initialValues, mode }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { ...defaultValues, ...initialValues }
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags'
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'highlights'
  });

  return (
    <form className="grid gap-6 lg:grid-cols-[2fr_1fr]" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Core details</h3>
          <Input
            label="Tour name"
            placeholder="Ex: Aurora Escape in Iceland"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Slug"
            placeholder="aurora-escape"
            {...register('slug', { required: 'Slug is required' })}
            error={errors.slug?.message}
          />
          <Select
            label="Status"
            options={statusOptions}
            {...register('status')}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Base price"
              type="number"
              min={0}
              {...register('price', { required: 'Price is required' })}
              error={errors.price?.message}
            />
            <Input
              label="Duration (days)"
              type="number"
              min={1}
              {...register('duration', { required: 'Duration is required' })}
              error={errors.duration?.message}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Capacity"
              type="number"
              min={1}
              {...register('seats', { required: 'Capacity is required' })}
              error={errors.seats?.message}
            />
            <Select
              label="Difficulty"
              options={difficultyOptions}
              {...register('difficulty')}
            />
          </div>
          <Input
            label="Hero image URL"
            placeholder="https://..."
            {...register('heroImage')}
          />
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Highlights</h3>
          <p className="text-xs text-slate-400">Maps to backend array `highlights[]`. Displayed on customer tour detail page.</p>
          <div className="space-y-4">
            {highlightFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <Input
                  className="flex-1"
                  placeholder="Describe premium experience"
                  {...register(`highlights.${index}.value`, { required: true })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHighlight(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => appendHighlight({ value: '' })}
            >
              <Plus className="h-4 w-4" />
              Add highlight
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Metadata</h3>
          <p className="text-xs text-slate-400">Control discoverability, search filters, and marketing tags.</p>
          <div className="space-y-3">
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <Input
                  placeholder="Luxury"
                  {...register(`tags.${index}.value`, { required: true })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTag(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => appendTag({ value: '' })}
            >
              <Plus className="h-4 w-4" />
              Add tag
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Save tour</h3>
          <p className="text-sm text-slate-500">Submit triggers backend `POST/PUT /tours`. Draft status keeps it hidden from customers.</p>
          <Button type="submit" size="lg" className="w-full">
            {mode === 'edit' ? 'Update tour' : 'Create tour'}
          </Button>
        </Card>
      </div>
    </form>
  );
};

TourForm.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  mode: PropTypes.oneOf(['create', 'edit'])
};

export default TourForm;
