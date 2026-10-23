import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { useStore } from '../lib/store';
import { Button, Container, cx } from '../components/ui';

const field = 'mt-1.5 h-11 w-full rounded-lg border border-line px-3 text-[15px]';

export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/portal';
  const live = isFirebaseConfigured() && auth;

  const done = (name: string, email: string, demo = false) => {
    signIn({ name, email }, demo);
    navigate(next);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email'));
    const password = String(f.get('password'));
    const name = String(f.get('name') ?? '') || email.split('@')[0];
    setError('');
    if (!live) {
      done(name, email, true);
      return;
    }
    setBusy(true);
    try {
      if (mode === 'in') {
        const r = await signInWithEmailAndPassword(auth!, email, password);
        done(r.user.displayName || name, email);
      } else {
        const r = await createUserWithEmailAndPassword(auth!, email, password);
        await updateProfile(r.user, { displayName: name });
        done(name, email);
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      setError(
        code.includes('invalid-credential') || code.includes('wrong-password')
          ? 'That email and password don’t match. Check them or reset your password.'
          : code.includes('email-already-in-use')
            ? 'An account already exists for this email. Log in instead.'
            : code.includes('weak-password')
              ? 'Use a password with at least 6 characters.'
              : 'Couldn’t sign you in. Check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    if (!live || !googleProvider) return;
    try {
      const r = await signInWithPopup(auth!, googleProvider);
      done(r.user.displayName || 'Student', r.user.email || '');
    } catch {
      setError('Google sign-in was cancelled or blocked. Try again or use email.');
    }
  };

  return (
    <div className="bg-mist">
      <Container className="grid min-h-[calc(100vh-72px)] place-items-center py-12">
        <div className="w-full max-w-[440px] rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h1 className="text-[28px] font-bold">{mode === 'in' ? 'Log in to your portal' : 'Create your account'}</h1>
          <p className="mt-1 text-muted">Your courses, labs, assignments and kit orders in one place.</p>

          <div className="mt-6 grid grid-cols-2 rounded-lg bg-mist p-1" role="tablist">
            {(['in', 'up'] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={cx('rounded-md py-2 text-sm font-semibold cursor-pointer', mode === m ? 'bg-white text-ink shadow-sm' : 'text-muted')}>
                {m === 'in' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {live && (
            <>
              <Button variant="outline" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
              <p className="my-5 text-center text-sm text-muted">or use email</p>
            </>
          )}

          <form onSubmit={submit} className={cx('grid gap-4', !live && 'mt-6')}>
            {mode === 'up' && (
              <label className="text-sm font-medium text-ink">
                Full name
                <input name="name" required autoComplete="name" className={field} />
              </label>
            )}
            <label className="text-sm font-medium text-ink">
              Email
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="text-sm font-medium text-ink">
              Password
              <input name="password" type="password" required minLength={6} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} className={field} />
            </label>
            {error && <p className="text-sm font-medium text-edge" role="alert">{error}</p>}
            <Button type="submit" size="lg" disabled={busy}>{busy ? 'Please wait…' : mode === 'in' ? 'Log in' : 'Create account'}</Button>
          </form>

          {!live && (
            <div className="mt-6 rounded-lg bg-honey-soft p-4 text-sm text-ink">
              <p className="font-semibold">Preview mode</p>
              <p className="mt-1 text-ink/80">Firebase keys aren't set, so any email logs you in with a sample learner's data.</p>
              <button className="mt-2 font-semibold text-blue hover:underline cursor-pointer" onClick={() => done('Aarav Sharma', 'aarav@example.com', true)}>
                Open the sample student portal
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
