import { useState } from 'react';
import { Lock, Shield, Webhook } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';

const Settings = () => {
  const [environment, setEnvironment] = useState('production');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Platform settings</h1>
        <p className="text-sm text-slate-500">Control payment gateways, webhook secrets, and automation toggles.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Environments</h2>
              <p className="text-sm text-slate-500">Switch between sandbox and production modes.</p>
            </div>
          </div>
          <Select
            label="Active environment"
            value={environment}
            onChange={(event) => setEnvironment(event.target.value)}
            options={[
              { value: 'production', label: 'Production' },
              { value: 'staging', label: 'Staging' },
              { value: 'sandbox', label: 'Sandbox' }
            ]}
          />
          <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
            Syncs with backend config service. Update `.env` values or environment variables accordingly.
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Payment gateway</h2>
              <p className="text-sm text-slate-500">Configure Stripe keys, bank transfers, or local wallets.</p>
            </div>
          </div>
          <Input label="Public key" placeholder="pk_live_..." />
          <Input label="Secret key" placeholder="sk_live_..." />
          <Button variant="secondary" size="sm" className="w-full">
            Save payment credentials
          </Button>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Webhook className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Webhook endpoints</h2>
            <p className="text-sm text-slate-500">Emit booking, tour, and review events to your automation stack.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Booking webhook URL" placeholder="https://..." />
          <Input label="Tour webhook URL" placeholder="https://..." />
          <Input label="Review webhook URL" placeholder="https://..." />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            Test payload
          </Button>
          <Button size="sm">
            Save endpoints
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
