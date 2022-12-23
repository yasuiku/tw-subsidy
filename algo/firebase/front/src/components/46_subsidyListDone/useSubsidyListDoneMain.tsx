import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useSubsidyListDoneMain = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (router.query.proc === "approve") {
            setTitle("処理完了")
            setMsg("承認処理が完了しました。")
        }
        else if (router.query.proc === "delete") {
            setTitle("承認取消完了")
            setMsg("承認を取り消しました。")
        }
    })

    const onSubmit = () => {
        router.push("/00_menu")
    };

    const back = () => {
        router.push('/44_subsidyList', '/44_subsidyList');
    }

    return { title, msg, onSubmit, back }
};

export default useSubsidyListDoneMain;