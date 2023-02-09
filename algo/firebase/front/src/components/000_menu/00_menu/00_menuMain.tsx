import { useRecoilState } from 'recoil';

import Header from '@/components/common/Header';

import holderDidAccountState from '@/lib/states/holderDidAccountState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';
import verifierDidAccountState from '@/lib/states/verifierDidAccountState';
import { useEffect, useState } from 'react';
import SelectActorButton from '../../common/SelectActorButton';
import useDataClear from '@/components/util/useDataClear';



const MenuMain = () => {


  const [holderDidAccountGlobal] = useRecoilState(holderDidAccountState);
  const [issuerDidAccountGlobal] = useRecoilState(issuerDidAccountState);
  const [verifierDidAccountGlobal] = useRecoilState(verifierDidAccountState);

  const [haveDid, setHaveDid] = useState(true)

  const { clearMsg, clearAllState } = useDataClear();


  useEffect(() => {
    if (holderDidAccountGlobal && issuerDidAccountGlobal && verifierDidAccountGlobal) {
      setHaveDid(true);
    }
    else {
      setHaveDid(false);
    }
  }, [holderDidAccountGlobal, issuerDidAccountGlobal, verifierDidAccountGlobal]);


  return (
    <>
      <Header />
      <main className="bg-color-background">
        {haveDid
          ? null
          : <>
            <div className={"flex flex-col items-center"}>
              <p className='text-color-required text-sm text-center w-78'>リンクからDIDを作成してください。</p>
              <div className="w-56 mx-auto border-2 border-blue-500 rounded-full text-center hover:bg-blue-400 hover:text-white">
                <a href="/simple-demo-accounts">DIDの作成</a>
              </div>
            </div>
          </>
        }
        <section className={"flex flex-col gap-6 w-fit mx-auto mt-11"}>
          <SelectActorButton target="applier" haveDid={haveDid} />
          <div className={"flex flex-col gap-3"}>
            <SelectActorButton target="resident" haveDid={haveDid} />
            <SelectActorButton target="account" haveDid={haveDid} />
            <SelectActorButton target="tax" haveDid={haveDid} />
          </div>
          <SelectActorButton target="subsidy" haveDid={haveDid} />
        </section>
        <div className="pt-32 pl-4 pb-4 flex justify-between">
          <button onClick={clearAllState} className={"input-form-button-small " + (haveDid ? "" : "bg-color-gray-search opacity-30")} disabled={!haveDid}>
            データクリア
          </button>
        </div>
        <div className={"relative pl-4"}>
          <p className='absolute -translate-y-24 text-color-required text-sm w-78 pt-4'>{clearMsg}</p>
        </div>
      </main>
    </>
  );
};

export default MenuMain;
