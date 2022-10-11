import { useEffect } from 'react';
import Button from '@/common/Button';
import { useToast } from '@/common/Notifications';
import { useStatesContext } from '@/contexts/states';
import { ErrorHandler } from '@/SplConverter/components/common/ErrorHandler';
import { TransferInfo } from '@/SplConverter/components/common/TransferInfo';
import { useTransfering } from '@/SplConverter/hooks/transfering';
import { ReactComponent as ArrowIcon } from '@/assets/arrow-right.svg';
import { TokenSymbol } from '@/SplConverter/components/common/TokenManager/components/TokenSymbol';
import { Direction } from '@/contexts/models';

export function Confirm() {
  const { addToast } = useToast();
  const { amount, token, direction, error } = useStatesContext();
  const { deposit, withdraw } = useTransfering();

  const handleConfirmTransfer = () => {
    switch (direction) {
      case Direction.neon:
        deposit(amount, token);
        break;
      case Direction.solana:
        withdraw(amount, token);
        break;
    }
  };

  useEffect(() => {
    if (error) {
      addToast(error, 'ERROR');
    }
  }, [error]);

  return (
    <div className='w-full flex flex-col'>
      <div className='flex flex-col items-center'>
        <TokenSymbol src={token?.logoURI} alt={token?.name}
                     style={{ width: '56px', height: '56px' }} className='mb-4' />
        <div className='text-2xl font-medium mb-8'>{`${amount} ${token?.symbol}`}</div>
      </div>
      <div className='flex justify-between mb-8'>
        <div
          className='w-5/12 p-6 flex items-center justify-center bg-pinky-white border border-transparent dark:bg-dark-600 dark:border-op15-white'>
          {direction === Direction.neon ? 'Solana' : 'Neon'}
        </div>
        <div className='w-1/6 flex items-center justify-center'>
          <ArrowIcon />
        </div>
        <div
          className='w-5/12 p-6 flex items-center justify-center bg-pinky-white border border-transparent dark:bg-dark-600 dark:border-op15-white'>
          {direction === Direction.neon ? 'Neon' : 'Solana'}
        </div>
      </div>
      <TransferInfo className='mb-8' />
      <Button onClick={handleConfirmTransfer}>Confirm</Button>
      <ErrorHandler className='mt-8 text-red-500' />
    </div>
  );
}
