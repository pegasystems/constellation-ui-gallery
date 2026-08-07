import React, { useCallback, useEffect, useRef } from 'react';
import SignaturePad, { type Options } from 'signature_pad';
import { useTheme } from '@pega/cosmos-react-core';

interface SignatureProps extends Options {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  signaturePadRef?: React.MutableRefObject<SignaturePad | undefined>;
  onEndStroke?: CallableFunction;
}

const Signature = (props: SignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad>();
  const { signaturePadRef, canvasProps, onEndStroke } = props;
  const theme = useTheme();
  const clearCanvas = () => {
    return padRef?.current?.clear();
  };

  const resizeCanvas = useCallback(() => {
    if (canvasRef?.current) {
      const canvas = canvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
    }
  }, [canvasRef.current]);

  useEffect(() => {
    const initSignaturePad = () => {
      resizeCanvas();
      return padRef?.current?.on();
    };

    const canvas = canvasRef?.current;
    if (!canvas) return;

    const signaturePad = new SignaturePad(canvas, {
      penColor: theme.base.palette['foreground-color'],
    });
    padRef.current = signaturePad;
    if (signaturePadRef) {
      signaturePadRef.current = signaturePad;
    }

    const handleEndStroke = () => {
      onEndStroke?.();
    };
    if (onEndStroke) {
      signaturePad.addEventListener('endStroke', handleEndStroke);
    }

    initSignaturePad();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      if (onEndStroke) {
        signaturePad.removeEventListener('endStroke', handleEndStroke);
      }
      window.removeEventListener('resize', resizeCanvas);
      clearCanvas();
      padRef?.current?.off();
    };
  }, []);

  return <canvas ref={canvasRef} {...canvasProps} />;
};

export default Signature;
