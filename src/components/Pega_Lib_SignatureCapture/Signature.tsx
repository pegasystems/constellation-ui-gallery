import React, { useCallback, useEffect, useRef } from 'react';
import SignaturePad, { type Options } from 'signature_pad';
import { useTheme } from '@pega/cosmos-react-core';

interface SignatureProps extends Options {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  signaturePadRef?: React.MutableRefObject<SignaturePad | undefined>;
  onEndStroke?: CallableFunction;
}

const Signature = (props: SignatureProps) => {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refSignaturePad = useRef<SignaturePad>();
  const { signaturePadRef, canvasProps, onEndStroke } = props;
  const theme = useTheme();
  const clearCanvas = () => {
    return refSignaturePad?.current?.clear();
  };

  const resizeCanvas = useCallback(() => {
    if (refCanvas?.current) {
      const canvas = refCanvas.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refCanvas.current]);

  useEffect(() => {
    const initSignaturePad = () => {
      resizeCanvas();
      return refSignaturePad?.current?.on();
    };

    const stopSignaturePad = () => {
      window.removeEventListener('resize', resizeCanvas);
      clearCanvas();
      return refSignaturePad?.current?.off();
    };

    const canvas = refCanvas?.current;
    if (!canvas) return;

    const signaturePad = new SignaturePad(canvas, {
      penColor: theme.base.palette['foreground-color'],
    });
    refSignaturePad.current = signaturePad;
    if (signaturePadRef) {
      signaturePadRef.current = signaturePad;
    }
    if (onEndStroke) {
      signaturePad.addEventListener('endStroke', () => {
        onEndStroke();
      });
    }

    initSignaturePad();
    window.addEventListener('resize', resizeCanvas);
    return () => stopSignaturePad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={refCanvas} {...canvasProps} />;
};

export default Signature;
