import { FC } from 'react';
import { ListFrameComponentType } from '../../../../../FilesToDistribute/constants';
import Image from 'next/legacy/image';
import DOMPurify from 'dompurify';

type LFComponentProps = {
    componentType: ListFrameComponentType;
    evaluated: string;
};

const LFComponent: FC<LFComponentProps> = ({ componentType, evaluated }) => {
    if (componentType == ListFrameComponentType.Text) {
        return <div className={''}>{evaluated}</div>;
    } else if (componentType == ListFrameComponentType.Link) {
        return (
            <a href={evaluated} className={''} target="_blank">
                {evaluated}
            </a>
        );
    } else if (componentType == ListFrameComponentType.Date) {
        return <div className={''}>{evaluated}</div>;
    } else if (componentType == ListFrameComponentType.ImagePreview) {
        return (
            <div className={''}>
                <div className="ImagePreview">
                    <Image
                        src={evaluated}
                        alt="Náhled obrázku"
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                    />
                </div>
            </div>
        );
    } else if (componentType == ListFrameComponentType.RichTextField) {
        return (
            <div className={''}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(evaluated),
                    }}
                ></div>
            </div>
        );
    } else {
        return <div className={''}></div>;
    }
};

export default LFComponent;
