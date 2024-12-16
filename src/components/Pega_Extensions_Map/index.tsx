import {
  withConfiguration,
  useTheme,
  Card,
  Text,
  CardContent,
  CardHeader,
  Button
} from '@pega/cosmos-react-core';
import MapView from '@arcgis/core/views/MapView';
import Draw from '@arcgis/core/views/draw/Draw';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Map from '@arcgis/core/Map';
import Search from '@arcgis/core/widgets/Search';
import Track from '@arcgis/core/widgets/Track';
import Sketch from '@arcgis/core/widgets/Sketch';
import { useEffect, useRef } from 'react';
import { StyledClearBtn, StyledPegaExtensionsMap } from './styles';
import { getAllFields, createGraphic, deletePoints, addPoint, addScreenShot } from './utils';
import '../create-nonce';

type MapProps = {
  getPConnect?: any;
  heading?: string;
  height?: string;
  Latitude?: string;
  Longitude?: string;
  Zoom?: string;
  displayMode: string;
  bFreeFormDrawing: boolean;
  bShowSearch: boolean;
};

type VerticesProps = {
  ptLayer: GraphicsLayer;
  view: MapView;
  draw: Draw;
  event: any;
  embedDataRef: string;
  latitudePropRef: string;
  longitudePropRef: string;
  imageMapRef: string;
};

export const PegaExtensionsMap = (props: MapProps) => {
  const {
    getPConnect,
    heading = 'Map',
    height = '40rem',
    Latitude = '34',
    Longitude = '-118',
    Zoom = '8',
    displayMode = '',
    bFreeFormDrawing = false,
    bShowSearch = false
  } = props;
  const theme = useTheme();

  const mapDiv = useRef(null);
  const btnClearRef = useRef<HTMLButtonElement>(null);
  const numPoints = useRef<number>(0);
  const isLastActionClear = useRef<boolean>(false);

  // Checks if the last vertex is making the line intersect itself.
  const updateVertices = (vars: VerticesProps) => {
    const {
      ptLayer,
      view,
      draw,
      event,
      embedDataRef,
      latitudePropRef,
      longitudePropRef,
      imageMapRef
    } = vars;
    // create a polyline from returned vertices
    if (event.vertices.length > 1) {
      createGraphic(ptLayer, view, event.vertices, true, theme);
    }
    if (event.type === 'draw-complete') {
      const action = draw.create('polyline');
      action.on(
        ['vertex-add', 'vertex-remove', 'cursor-update', 'redo', 'undo', 'draw-complete'],
        newEvent => {
          updateVertices({ ...vars, event: newEvent });
        }
      );

      /* Update the cache with the set of instructions - only clear if the last action was not the clear action */
      if (!isLastActionClear.current) {
        deletePoints(getPConnect, props, embedDataRef, numPoints.current);
      } else {
        isLastActionClear.current = false;
      }
      event.vertices.forEach((x: any, index: number) => {
        addPoint(getPConnect, props, embedDataRef, longitudePropRef, latitudePropRef, index, x);
      });
      numPoints.current = event.vertices.length;

      addScreenShot(getPConnect, view, imageMapRef);
    }
  };

  /**
   * Initialize application
   */
  useEffect(() => {
    const tmpFields: any = getAllFields(getPConnect);

    let embedDataRef = '';
    let longitudePropRef = '';
    let latitudePropRef = '';
    let imageMapRef = '';
    let locationRef = '';
    let map: Map;
    let view: MapView;
    let ptLayer: GraphicsLayer;

    if (displayMode !== 'DISPLAY_ONLY') {
      getPConnect().getListActions().initDefaultPageInstructions('.Locations');
    }

    /* Retrieve the name of the embedded object when bFreeFormDrawing is false */
    if (!bFreeFormDrawing && tmpFields.length >= 2) {
      let paths = tmpFields[0].path?.split(' ');
      if (paths && paths.length === 2) {
        embedDataRef = paths[1].substring(0, paths[1].indexOf('[')).trim();
        latitudePropRef = paths[1].substring(paths[1].indexOf(']') + 1).trim();
      }
      paths = tmpFields[1].path?.split(' ');
      if (paths && paths.length === 2) {
        longitudePropRef = paths[1].substring(paths[1].indexOf(']') + 1).trim();
      }
      if (tmpFields.length >= 3) {
        paths = tmpFields[2].path?.split(' ');
        if (paths && paths.length === 2) {
          imageMapRef = paths[1];
        }
      }
    }
    /* Retrieve the name of the embedded object when bFreeFormDrawing is true */
    if (bFreeFormDrawing && tmpFields.length > 0) {
      if (tmpFields[0].type === 'Location') {
        const locationPropPath = tmpFields[0].path?.replace('@P ', '');
        const lastSeparator = locationPropPath.lastIndexOf('.');
        locationRef = locationPropPath.substring(0, lastSeparator);
      }
      if (tmpFields.length >= 2) {
        const paths = tmpFields[1].path?.split(' ');
        if (paths && paths.length === 2) {
          imageMapRef = paths[1];
        }
      }
    }

    if (mapDiv.current) {
      ptLayer = new GraphicsLayer();
      map = new Map({
        basemap: 'gray-vector',
        layers: [ptLayer]
      });

      view = new MapView({
        container: mapDiv.current,
        map,
        center: [parseFloat(Longitude), parseFloat(Latitude)],
        zoom: parseFloat(Zoom)
      });

      const draw = new Draw({
        view
      });

      if (displayMode !== 'DISPLAY_ONLY') {
        if (bFreeFormDrawing) {
          const sketchWidget = new Sketch({
            view,
            layer: ptLayer
          });
          view.ui.add(sketchWidget, 'top-right');
        }
        if (bShowSearch) {
          const searchWidget = new Search({
            view
          });
          view.ui.add(searchWidget, 'top-right');
          if (locationRef) {
            searchWidget.on('select-result', (event: any) => {
              const result = event.result;
              if (result?.feature?.geometry) {
                const latitude = result.feature.geometry.latitude;
                const longitude = result.feature.geometry.longitude;
                const messageConfig = {
                  meta: props,
                  options: {
                    context: getPConnect().getContextName(),
                    pageReference: `caseInfo.content${locationRef}`,
                    target: getPConnect().getTarget()
                  }
                };
                const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
                const actionsApi = c11nEnv.getPConnect().getActionsApi();
                actionsApi.updateFieldValue('.pyLatLon', `${latitude}, ${longitude}`);
                actionsApi.updateFieldValue('.pyAddress', result.name);
              }
            });
          }
          const track = new Track({
            view
          });
          view.ui.add(track, 'top-left');
        }

        if (!bFreeFormDrawing) {
          if (btnClearRef?.current) {
            view.ui.add([
              {
                component: btnClearRef.current,
                position: 'top-right',
                index: 1
              }
            ]);
          }

          const action = draw.create('polyline');
          action.on(
            ['vertex-add', 'vertex-remove', 'cursor-update', 'redo', 'undo', 'draw-complete'],
            event => {
              updateVertices({
                ptLayer,
                view,
                draw,
                event,
                embedDataRef,
                latitudePropRef,
                longitudePropRef,
                imageMapRef
              });
            }
          );

          if (btnClearRef?.current) {
            btnClearRef.current.onclick = () => {
              ptLayer.removeAll();
              deletePoints(getPConnect, props, embedDataRef, numPoints.current);
              isLastActionClear.current = true;
            };
          }
        }
      }
      view.focus();

      /* If values are populated, load the polyline */
      if (tmpFields.length > 1 && tmpFields[0].value?.length > 0) {
        const vertices: any = [];
        tmpFields[0].value.forEach((val: any, index: any) => {
          vertices.push([tmpFields[1].value[index], val]);
        });
        numPoints.current = vertices.length;
        createGraphic(ptLayer, view, vertices, false, theme);
      }
    }
    return () => {
      ptLayer.removeAll();
      view.graphics.removeAll();
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Latitude, Longitude, Zoom, height, displayMode, bFreeFormDrawing, bShowSearch]);

  return (
    <Card>
      <CardHeader>
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>
        <StyledClearBtn hide={displayMode === 'DISPLAY_ONLY' || bFreeFormDrawing}>
          <Button ref={btnClearRef}>Clear</Button>
        </StyledClearBtn>
        <StyledPegaExtensionsMap height={height} ref={mapDiv} />
      </CardContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsMap);
