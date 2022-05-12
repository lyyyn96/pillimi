import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';

const MyWebView = ({handleClose, handleSetRef, handleEndLoading, pushUrl}) => {
  const BASE_URL = 'https://k6a307.p.ssafy.io';
  const [webview, setWebview] = useState();
  const [goBackable, setGoBackable] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log('goBackable', goBackable);
        if (goBackable) webview.goBack();
        else handleClose();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [goBackable]);
  useEffect(() => {
    // setWebview(handleSetRef)
    console.log('여기는 webview' + pushUrl);
    if (webview && webview.clearCache) webview.clearCache();
  }, [webview]);
  return (
    <WebView
      pullToRefreshEnabled={true}
      startInLoadingState={true}
      allowsBackForwardNavigationGestures={true}
      source={{uri: pushUrl}}
      mixedContentMode={'compatibility'}
      originWhitelist={['https://*', 'http://*']}
      overScrollMode={'never'}
      ref={handleSetRef}
      onLoadEnd={handleEndLoading}
      injectedJavaScript={` (function() {
              function wrap(fn) {
                 return function wrapper() {
                    var res = fn.apply(this, arguments); 
                    window.ReactNativeWebView.postMessage(window.location.href); 
                    return res; 
                  } 
                } 
                history.pushState = wrap(history.pushState); 
                history.replaceState = wrap(history.replaceState); 
                window.addEventListener('popstate', function() {
                   window.ReactNativeWebView.postMessage(window.location.href); 
                  }); 
                })(); 
                true; `}
      onMessage={event => {
        const url = event.nativeEvent.data;
        setGoBackable(url !== BASE_URL);
        console.log('onMessage : 페이지 이동', event.nativeEvent.data);
      }}
    />
  );
};
export default MyWebView;
