import { AccountCard, AccountCardDefault } from '@/components/account';
import { BottomNavigation, Header } from '@/components/atoms';
import Container from '@/components/containers/Container';
import {
  HouseLoanCard,
  MainDashBoard,
  PopularPartner,
} from '@/components/home';
import { MainAccount, SubAccount } from '@/types/Account';
import { use } from 'react';
import {
  getAccountsByUserId,
  getCoupleTotalBalance,
} from '@/lib/actions/AccountActions';
import { getCategoryData } from '@/lib/actions/AssetActions';
import { getUserInfo } from '@/lib/actions/UserActions';
import { getCoupleNames } from '@/lib/actions/getCoupleUserIds';
import { auth } from '@/lib/auth';

export default function Home() {
  const session = use(auth());
  const userId = Number(session?.user?.id);

  const mainUserId = session?.user?.isMain
    ? Number(session.user.id)
    : Number(session?.user?.partnerId);

  const accounts = use(getAccountsByUserId(userId));
  const coupleBalance = use(getCoupleTotalBalance(userId));
  const coupleNames = use(getCoupleNames(userId));
  const main = accounts.data.find((acc) => acc.type === 0);
  const subs = accounts.data.filter((acc) => acc.type !== 0);

  const mainAccountData: (MainAccount & { id: number }) | undefined = main && {
    id: main.id,
    type: 0,
    account: main.account,
    balance: main.balance,
  };

  const subAccounts: SubAccount[] =
    subs &&
    subs.map((acc) => ({
      type: acc.type as 1 | 2 | 3,
      balance: acc.balance,
    }));

  const userInfoResult = use(getUserInfo(userId));
  const marriageDate =
    userInfoResult?.isSuccess && userInfoResult.data
      ? (userInfoResult.data['결혼 예정일'] ?? '')
      : '';

  const categoryDataResult = use(getCategoryData(mainUserId));
  const categoryData =
    categoryDataResult?.isSuccess && categoryDataResult.data
      ? categoryDataResult.data
      : [];

  return (
    <Container
      className='gap-[20px] pt-[70px] pb-[82.5px]'
      header={<Header leftIcon='my' rightIcon='bell' />}
      footer={<BottomNavigation selectedItem='home' />}
    >
      {!userId || !mainAccountData ? (
        <AccountCardDefault />
      ) : (
        <AccountCard
          userId={userId}
          coupleBalance={coupleBalance.data}
          subAccounts={subAccounts}
          coupleNames={coupleNames}
        />
      )}
      <MainDashBoard date={marriageDate} categoryData={categoryData} />
      <HouseLoanCard />
      <PopularPartner />
    </Container>
  );
}
