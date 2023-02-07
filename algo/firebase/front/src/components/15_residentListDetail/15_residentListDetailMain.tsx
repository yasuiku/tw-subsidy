import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

import Header from '../common/Header';
import { residentVCListState, residentVCRequestListState, VCListState } from '@/lib/states/mockApp';
import { verifyVerifiableMessage, createVerifiableCredential, createVerifiableMessage } from '@/lib/algosbt';
import { getAlgod } from '@/lib/algo/algod/algods';
import chainState from '@/lib/states/chainState';
import holderDidAccountState from '@/lib/states/holderDidAccountState';
import issuerDidAccountState from '@/lib/states/issuerDidAccountState';

import { holderPw, issuerPw } from '@/lib/algo/account/accounts';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { ResidentVCRequestType } from '@/lib/types/mockApp';
import { ResidentInquiry } from '../common/Forms';

const ResidentListDetailMain = () => {
  const router = useRouter();
  const errorHandler = useErrorHandler();

  const [listState, setListState] = useRecoilState(residentVCRequestListState);
  const setVCList = useSetRecoilState(residentVCListState);
  const setIssuedVCList = useSetRecoilState(VCListState);
  const [isIssuing, setIsIssuing] = useState(false);
  const [selectDetail, SetSelectDetail] = useState<ResidentVCRequestType>();

  const chainType = useRecoilValue(chainState);
  const holderDidAccountGlobal = useRecoilValue(holderDidAccountState);
  const issuerDidAccountGlobal = useRecoilValue(issuerDidAccountState);
  dayjs.locale("ja")

  useEffect(() => {
    const select = listState.find((v) => v.message.content.id === Number(router.query.id));
    SetSelectDetail(() => select)
  }, [listState, router.query]);

  const verify = () => {
    try {
      if (selectDetail && holderDidAccountGlobal && issuerDidAccountGlobal) {
        const verified = verifyVerifiableMessage(selectDetail);
        const replaceData = { ...selectDetail.message.content, verifyStatus: verified }
        const updateData = listState.map((item) => {
          if (item.message.content.id === replaceData.id) {
            return createVerifiableMessage(
              holderDidAccountGlobal,
              issuerDidAccountGlobal.did,
              replaceData,
              holderPw
            );
          }
          else {
            return item;
          }
        });
        setListState(() => updateData);
      }
    } catch (e) {
      errorHandler(e);
    }
  }


  const approve = async () => {
    try {
      if (selectDetail && holderDidAccountGlobal && issuerDidAccountGlobal) {
        setIsIssuing(true);

        if (selectDetail.message.content.verifyStatus) {
          const algod = getAlgod(chainType);
          dayjs.locale('ja');
          const now = dayjs();
          const content = selectDetail.message.content;
          const vcContent = {
            ...content,
            approvalStatus: true,
            issueDate: dayjs(now).format('YYYY-MM-DD HH:mm:ss')
          };
          const vc = await createVerifiableCredential(
            algod,
            issuerDidAccountGlobal,
            holderDidAccountGlobal.did,
            vcContent,
            issuerPw
          );
          const updateData = listState.map((item) => {
            if (item.message.content.id === vcContent.id) {
              return createVerifiableMessage(
                holderDidAccountGlobal,
                issuerDidAccountGlobal.did,
                vcContent,
                holderPw
              );
            }
            else {
              return item;
            }
          });
          setListState(() => updateData);
          setVCList((items) => [...items, vc]);
          setIssuedVCList((items) => ({ ...items, resident: [...items.resident, vc] }));
          setIsIssuing(false);
          router.push({ pathname: "/16_resident-list-done", query: { id: router.query.id, proc: "approve" } });
        }
      }
    } catch (e) {
      setIsIssuing(false);
      errorHandler(e);
    }
  };

  const reject = () => {
    router.push({ pathname: "/16_resident-list-done", query: { id: router.query.id, proc: "reject" } });
  }

  return (
    <>
      <Header />
      <main className="bg-color-background">{selectDetail &&

        <section className={"flex flex-col items-center gap-1 w-72 mx-auto mb-2 pb-4 border-b"}>
          {selectDetail.message.content.verifyStatus
            ? <p className={"relative text-sm leading-relaxed"}><img src='/authenticated.svg' className={"absolute top-0 -translate-y-3 -translate-x-full"} />検証済</p>
            : <p className={"relative text-sm leading-relaxed"}><img src='/warning.svg' className={"absolute -translate-x-full pr-2"} /> 要検証</p>
          }
          <p className={"text-sm text-color-gray-search leading-relaxed"}>{selectDetail.message.content.approvalStatus?"承認済":"未承認"}</p>
          <p className={"text-xs text-color-gray-search leading-relaxed"}>申請日 {dayjs(selectDetail.message.content.applicationDate).format("YY/MM/DD HH:mm")}</p>
        </section>
      }
        <div className="py-0 px-[53px]">
          {selectDetail && <ResidentInquiry input={selectDetail.message.content} />}
          <div className={"relative"}>
            {isIssuing
              ? <span className={"absolute right-0 -translate-y-1/2 text-sm leading-relaxed text-yellow-500"}>VC発行中...</span>
              : null
            }
          </div>
          <div className="pt-4 flex justify-between">
            <button
              onClick={() => router.push('/14_resident-list')}
              className="input-form-button-white"
            >
              戻る
            </button>
            {
              selectDetail && selectDetail.message.content.verifyStatus
                ? <>
                  <button
                    onClick={reject}
                    className="input-form-button-white"
                  >
                    却下
                  </button>
                  <button
                    onClick={approve}
                    className="input-form-button-blue"
                  >
                    承認
                  </button>
                </>
                :
                <button
                  onClick={verify}
                  className="input-form-button-blue"
                >
                  検証
                </button>
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default ResidentListDetailMain;
