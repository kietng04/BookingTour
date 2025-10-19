import TourForm from '../../components/tours/TourForm.jsx';

const TourCreate = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Create tour</h1>
      <p className="text-sm text-slate-500">This form mirrors backend validation. On submit send payload to `POST /admin/tours`.</p>
    </div>
    <TourForm
      mode="create"
      onSubmit={(data) => {
        // eslint-disable-next-line no-console
        console.log('Create tour payload', data);
      }}
    />
  </div>
);

export default TourCreate;
