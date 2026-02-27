import {
  withConfiguration,
  useTheme,
  Card,
  Text,
  CardContent,
  CardHeader,
  Button,
  Progress,
} from '@pega/cosmos-react-core';
import type MapView from '@arcgis/core/views/MapView';
import type Map from '@arcgis/core/Map';
import type GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import type Draw from '@arcgis/core/views/draw/Draw';
import type Graphic from '@arcgis/core/Graphic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyledClearBtn, StyledPegaExtensionsMap } from './styles';
import { getAllFields, renderShapes, createGraphic, deletePoints, addPoint, addScreenShot } from './utils';
import '../shared/create-nonce';

const ARCGIS_VERSION = '5.0';
type MapProps = {
  getPConnect?: any;
  heading?: string;
  height?: string;
  displayMode: string;
  /**
   * Display the sketch widget to allow free-form drawing on the map.
   * @default false
   */
  bFreeFormDrawing: boolean;
  /**
   * Display a location field on the UI to search for a location.
   * @default false
   */
  bShowSearch: boolean;
  /**
   * if bFreeFormDrawing is true, this property will store and display the free-form shapes drawn on the canvas using the sketch widget.
   */
  selectionProperty?: string;
  /**
   * list of tools to use the map when bFreeFormDrawing is true - the list is comma separated.
   * The tools can be point, polyline, polygon, rectangle, circle.
   * @default point,polyline,polygon,rectangle,circle
   */
  createTools?: string;
  /**
   * API key for ArcGIS.
   */
  apiKey?: string;
  /**
   * Entry for Location Input - if type='constant' - set Latitude, Longitude and Zoom
   * if type='propertyRef' - set LocationRef and ZoomRef.
   */
  locationInputType?: 'constant' | 'propertyRef';
  /**
   * Latitude for rendering the map if locationInputType is set to 'constant'.
   * @default '34'
   */
  Latitude?: string;
  /**
   * Longitude for rendering the map if locationInputType is set to 'constant'.
   * @default '-118'
   */
  Longitude?: string;
  /**
   * Zoom for rendering the map if locationInputType is set to 'constant'.
   * @default '4'
   */

  Zoom?: string;
  /**
   * Zoom input property if locationInputType is set to 'propertyRef'.
   */
  ZoomRef?: string;
};

type VerticesProps = {
  ptLayer: GraphicsLayer;
  view: MapView | undefined;
  draw: Draw;
  event: any;
  embedDataRef: string;
  latitudePropRef: string;
  longitudePropRef: string;
  imageMapRef: string;
  Graphic: any;
  webMercatorUtils: any;
};

interface ShapeDefinition {
  type: string;
  coordinates: Array<{ x: number; y: number }> | { x: number; y: number };
}

export const PegaExtensionsMap = (props: MapProps) => {
  const {
    getPConnect,
    heading = 'Map',
    height = '40rem',
    locationInputType = 'constant',
    ZoomRef = '',
    Latitude = '34',
    Longitude = '-118',
    Zoom = '4',
    createTools = 'point,polyline,polygon,rectangle,circle',
    displayMode = '',
    selectionProperty,
    bFreeFormDrawing = false,
    bShowSearch = false,
    apiKey = '',
  } = props;
  const theme = useTheme();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const mapDiv = useRef(null);
  const btnClearRef = useRef<HTMLButtonElement>(null);
  const numPoints = useRef<number>(0);
  const isLastActionClear = useRef<boolean>(false);
  const metadata = getPConnect().getRawMetadata();

  const captureEvent = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const genShapeObject = (graphic: Graphic) => {
    if (graphic.geometry?.type === 'polygon') {
      const coordinates: { x: number; y: number }[] = [];
      graphic.geometry.rings.forEach((ring) => ring.map((coord) => coordinates.push({ x: coord[0], y: coord[1] })));

      return {
        type: 'polygon',
        coordinates,
      };
    }
    if (graphic.geometry?.type === 'polyline') {
      const coordinates: { x: number; y: number }[] = [];
      graphic.geometry.paths.forEach((path) => path.map((coord) => coordinates.push({ x: coord[0], y: coord[1] })));
      return {
        type: 'polyline',
        coordinates,
      };
    }
    const elem: any = graphic.geometry;
    return {
      type: 'point',
      coordinates: { x: elem.longitude, y: elem.latitude },
    };
  };
  // This function is called when a shape is added or removed by the sketch widget.
  const updateShapeDefinition = (event: any, ptLayer: GraphicsLayer) => {
    if (
      typeof selectionProperty !== 'undefined' &&
      metadata.config.selectionProperty &&
      (!event.state || event.state === 'complete')
    ) {
      const graphics = ptLayer.graphics;
      const listShapes: ShapeDefinition[] = [];

      // Filter and process polygon graphics
      graphics.forEach((graphic) => {
        listShapes.push(genShapeObject(graphic));
      });

      const prop = metadata.config.selectionProperty.replace('@P ', '');
      getPConnect()
        .getActionsApi()
        .updateFieldValue(prop, JSON.stringify({ shapes: listShapes }));
      getPConnect()
        .getActionsApi()
        .triggerFieldChange(prop, JSON.stringify({ shapes: listShapes }));
    }
  };

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
      imageMapRef,
      Graphic,
      webMercatorUtils,
    } = vars;
    if (view) {
      // create a polyline from returned vertices
      if (event.vertices.length > 1) {
        createGraphic(ptLayer, view, event.vertices, true, theme, Graphic);
      }
      if (event.type === 'draw-complete') {
        const action = draw.create('polyline');
        const handleActionEvent = (newEvent: any) => updateVertices({ ...vars, event: newEvent });
        const eventNames = ['vertex-add', 'vertex-remove', 'cursor-update', 'redo', 'undo', 'draw-complete'];
        eventNames.forEach((eventName) =>
          (action as { on(name: string, fn: (e: any) => void): void }).on(eventName, handleActionEvent),
        );

        /* Update the cache with the set of instructions - only clear if the last action was not the clear action */
        if (!isLastActionClear.current) {
          deletePoints(getPConnect, props, embedDataRef, numPoints.current);
        } else {
          isLastActionClear.current = false;
        }
        event.vertices.forEach((x: any, index: number) => {
          addPoint(getPConnect, props, embedDataRef, longitudePropRef, latitudePropRef, index, x, webMercatorUtils);
        });
        numPoints.current = event.vertices.length;

        addScreenShot(getPConnect, view, imageMapRef);
      }
    }
  };

  const initComponent = useCallback(async () => {
    // ArcGIS 5.0+: use ESM dynamic import (import map resolves @arcgis/core to CDN)
    const configModule = await import('@arcgis/core/config');
    const config = configModule.default;
    if (apiKey) {
      config.apiKey = apiKey;
    }

    const [
      SketchModule,
      SearchModule,
      TrackModule,
      MapModule,
      DrawModule,
      GraphicsLayerModule,
      MapViewModule,
      GraphicModule,
      webMercatorUtilsModule,
      SpatialReferenceModule,
    ] = await Promise.all([
      import('@arcgis/core/widgets/Sketch'),
      import('@arcgis/core/widgets/Search'),
      import('@arcgis/core/widgets/Track'),
      import('@arcgis/core/Map'),
      import('@arcgis/core/views/draw/Draw'),
      import('@arcgis/core/layers/GraphicsLayer'),
      import('@arcgis/core/views/MapView'),
      import('@arcgis/core/Graphic'),
      import('@arcgis/core/geometry/support/webMercatorUtils'),
      import('@arcgis/core/geometry/SpatialReference'),
    ]);
    const Sketch = SketchModule.default;
    const Search = SearchModule.default;
    const Track = TrackModule.default;
    const Map = MapModule.default;
    const Draw = DrawModule.default;
    const GraphicsLayer = GraphicsLayerModule.default;
    const MapView = MapViewModule.default;
    const Graphic = GraphicModule.default;
    const webMercatorUtils = webMercatorUtilsModule;
    const SpatialReference = SpatialReferenceModule.default;
    const tmpFields: any = getAllFields(getPConnect);

    let embedDataRef = '';
    let longitudePropRef = '';
    let latitudePropRef = '';
    let imageMapRef = '';
    let locationRef = '';
    let map: Map;
    let view: MapView | undefined;
    let ptLayer: GraphicsLayer;

    // In 24.2, we need to initialize the context tree manager
    if (displayMode !== 'DISPLAY_ONLY') {
      (window as any).PCore.getContextTreeManager().addPageListNode(
        getPConnect().getContextName(),
        'caseInfo.content',
        getPConnect().meta.name,
        'Locations',
      );
    }

    // Retrieve the name of the embedded object when bFreeFormDrawing is false
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
      for (let i = 2; i < tmpFields.length; i += 1) {
        if (tmpFields[i].type === 'Location') {
          const locationPropPath = tmpFields[i].path?.replace('@P ', '');
          const lastSeparator = locationPropPath.lastIndexOf('.');
          locationRef = locationPropPath.substring(0, lastSeparator);
        } else {
          paths = tmpFields[i].path?.split(' ');
          if (paths && paths.length === 2) {
            imageMapRef = paths[1];
          }
        }
      }
    }
    // Retrieve the name of the embedded object when bFreeFormDrawing is true
    if (bFreeFormDrawing) {
      for (let i = 0; i < tmpFields.length; i += 1) {
        if (tmpFields[i].type === 'Location') {
          const locationPropPath = tmpFields[i].path?.replace('@P ', '');
          const lastSeparator = locationPropPath.lastIndexOf('.');
          locationRef = locationPropPath.substring(0, lastSeparator);
        } else {
          const paths = tmpFields[i].path?.split(' ');
          if (paths && paths.length === 2) {
            imageMapRef = paths[1];
          }
        }
      }
    }

    if (mapDiv.current) {
      const spatialReference = new SpatialReference({ wkid: 3857 }); // Web Mercator
      ptLayer = new GraphicsLayer();
      map = new Map({
        basemap: 'streets-vector',
        layers: [ptLayer],
      });

      // Create the MapView with the specified container and properties
      if (locationInputType === 'propertyRef') {
        const inputLocation = getPConnect().getValue(locationRef);
        const LatLong = inputLocation?.pyLatLon?.split(',');
        if (LatLong && LatLong.length === 2) {
          view = new MapView({
            container: mapDiv.current,
            map,
            center: [parseFloat(LatLong[1]), parseFloat(LatLong[0])],
            zoom: parseFloat(ZoomRef),
            spatialReference,
          });
        }
      }
      /* If the locationRef is not set, use the constant values */
      if (!view) {
        view = new MapView({
          container: mapDiv.current,
          map,
          center: [parseFloat(Longitude), parseFloat(Latitude)],
          zoom: parseFloat(Zoom),
          spatialReference,
        });
      }
      if (view) {
        const draw = new Draw({
          view,
        });

        if (displayMode !== 'DISPLAY_ONLY') {
          if (bFreeFormDrawing) {
            const sketchWidget = new Sketch({
              view,
              layer: ptLayer,
              availableCreateTools: createTools.split(',').map((tool) => tool.toLowerCase().trim()) as any,
            });
            (['create', 'delete', 'update'] as const).forEach((eventName) =>
              sketchWidget.on(eventName, (event: any) => {
                updateShapeDefinition(event, ptLayer);
              })
            );
            view.ui.add(sketchWidget, 'top-right');
          }
          if (bShowSearch) {
            const searchWidget = new Search({
              view,
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
                      target: getPConnect().getTarget(),
                    },
                  };
                  const c11nEnv = (window as any).PCore.createPConnect(messageConfig);
                  const actionsApi = c11nEnv.getPConnect().getActionsApi();
                  actionsApi.updateFieldValue('.pyLatLon', `${latitude}, ${longitude}`);
                  actionsApi.updateFieldValue('.pyAddress', result.name);
                }
              });
            }
            const track = new Track({
              view,
            });
            view.ui.add(track, 'top-left');
          }

          if (!bFreeFormDrawing) {
            if (btnClearRef?.current) {
              view.ui.add([
                {
                  component: btnClearRef.current,
                  position: 'top-right',
                  index: 1,
                },
              ]);
            }

            const action = draw.create('polyline');
            const handleActionEvent = (event: any) =>
              updateVertices({
                ptLayer,
                view,
                draw,
                event,
                embedDataRef,
                latitudePropRef,
                longitudePropRef,
                imageMapRef,
                Graphic,
                webMercatorUtils,
              });
            const actionEventNames = ['vertex-add', 'vertex-remove', 'cursor-update', 'redo', 'undo', 'draw-complete'];
            actionEventNames.forEach((eventName) =>
              (action as { on(name: string, fn: (e: any) => void): void }).on(eventName, handleActionEvent),
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

        // If values are populated, load the polyline
        if (!bFreeFormDrawing && tmpFields.length > 1 && tmpFields[0].value?.length > 0) {
          const vertices: any = [];
          tmpFields[0].value.forEach((val: any, index: any) => {
            vertices.push([tmpFields[1].value[index], val]);
          });
          numPoints.current = vertices.length;
          createGraphic(ptLayer, view, vertices, false, theme, Graphic);
        }

        // If shaped are populated, in selectionProperty load the shaped
        if (bFreeFormDrawing && typeof selectionProperty !== 'undefined') {
          renderShapes(ptLayer, view, selectionProperty, Graphic);
        }
      }
    }

    return () => {
      ptLayer.removeAll();
      view?.graphics.removeAll();
      view?.destroy();
    };
  }, [Latitude, Longitude, Zoom, bFreeFormDrawing, bShowSearch, createTools, displayMode, selectionProperty, apiKey]);

  useEffect(() => {
    let importMap: HTMLScriptElement | null = null;
    let arcgisStylesheet: HTMLLinkElement | null = null;
    let arcgisCore: HTMLScriptElement | null = null;
    const loadScripts = async () => {
      try {
        // Add Import Map
        importMap = document.createElement('script');
        importMap.type = 'importmap';
        importMap.textContent = JSON.stringify({
          imports: {
            '@arcgis/core/': `https://js.arcgis.com/${ARCGIS_VERSION}/@arcgis/core/`,
          },
        });
        document.head.appendChild(importMap);

        // Load ArcGIS stylesheet
        arcgisStylesheet = document.createElement('link');
        arcgisStylesheet.rel = 'stylesheet';
        arcgisStylesheet.href = `https://js.arcgis.com/${ARCGIS_VERSION}/esri/themes/light/main.css`;
        document.head.appendChild(arcgisStylesheet);

        // ArcGIS 5.0+: module-based SDK — single script with type="module"
        arcgisCore = document.createElement('script');
        arcgisCore.type = 'module';
        arcgisCore.src = `https://js.arcgis.com/${ARCGIS_VERSION}/`;
        document.head.appendChild(arcgisCore);

        // Wait for Map components script to load
        await new Promise((resolve) => {
          if (arcgisCore) {
            arcgisCore.onload = resolve;
          } else {
            resolve(undefined);
          }
        });

        // Set scripts as loaded
        setScriptsLoaded(true);

        await initComponent();
      } catch (error) {
        console.error('Failed to load ArcGIS scripts:', error);
      }
    };

    loadScripts();

    // Cleanup function
    return () => {
      if (importMap) document.head.removeChild(importMap);
      if (arcgisStylesheet) document.head.removeChild(arcgisStylesheet);
      if (arcgisCore) document.head.removeChild(arcgisCore);
    };
  }, [initComponent]);

  if (!scriptsLoaded) {
    return (
      <Progress
        placement='local'
        message={(window as any).PCore.getLocaleUtils().getLocaleValue(
          'Loading content...',
          'Generic',
          '@BASECLASS!GENERIC!PYGENERICFIELDS',
        )}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <Text variant='h2'>{heading}</Text>
      </CardHeader>
      <CardContent>
        <StyledClearBtn hide={displayMode === 'DISPLAY_ONLY' || bFreeFormDrawing}>
          <Button ref={btnClearRef}>{getPConnect().getLocalizedValue('Clear')}</Button>
        </StyledClearBtn>
        <StyledPegaExtensionsMap height={height} ref={mapDiv} onClick={captureEvent} />
      </CardContent>
    </Card>
  );
};
export default withConfiguration(PegaExtensionsMap);
