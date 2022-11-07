// Type definitions for druid.io (version 0.10.0)
// Project: http://druid.io/
// Definitions by: Vadim Ogievetsky <https://github.com/vogievetsky/>
// Definitions: https://github.com/implyio/druid.d.ts

/*
 * Copyright 2015-2015 Metamarkets Group Inc.
 * Copyright 2015-2017 Imply Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare module Druid {
    /* ----------------------- *\
    |           Query           |
    \* ----------------------- */

    type FancyBoolean = boolean | "true" | "false";

    // http://druid.io/docs/latest/querying/query-context.html
    interface Context {
        timeout?: number;
        priority?: number;
        queryId?: number | string;
        useCache?: FancyBoolean;
        populateCache?: FancyBoolean;
        bySegment?: FancyBoolean;
        finalize?: FancyBoolean;
        chunkPeriod?: number;
        useOffheap?: FancyBoolean;
        groupByMerge?: FancyBoolean;
        skipIncrementalSegment?: FancyBoolean;
        skipEmptyBuckets?: FancyBoolean; // http://druid.io/docs/latest/querying/timeseriesquery.html

        // Undocumented:
        doAggregateTopNMetricFirst?: boolean;

        // Or whatever...
        [key: string]: any;
    }

    // http://druid.io/docs/latest/GeographicQueries.html
    interface SpatialBound {
        type: string;

        // Specific to type: "rectangular"
        minCoords?: number[];
        maxCoords?: number[];

        // Specific to type: "radius"
        coords?: number[];
        radius?: number;
    }

    // http://druid.io/docs/latest/querying/timeseriesquery.html
    type Intervals = string | string[];

    type Ordering = "lexicographic" | "alphanumeric" | "numeric" | "strlen";

    // http://druid.io/docs/latest/Filters.html
    interface Filter {
        type: string;
        dimension?: string;

        // Specific to type: "selector"
        value?: string;

        // Specific to type: "in"
        values?: string[];

        // Specific to type: "bound"
        lower?: number | string;
        upper?: number | string;
        lowerStrict?: boolean;
        upperStrict?: boolean;
        alphaNumeric?: boolean; // This is deprecated
        ordering?: Ordering;

        // Specific to type: "interval"
        intervals?: Intervals;

        // Specific to type: "regex"
        pattern?: string;

        // Specific to type: "search" (and "fullText" which is a string)
        query?: SearchQuerySpec | string;

        // Specific to type: "fullText"
        textColumn?: string;
        termsColumn?: string;
        matchAll?: boolean;
        usePrefixForLastTerm?: boolean;

        // Specific to type: "javascript"
        "function"?: string;

        // Specific to type: "spatial"
        bound?: SpatialBound;

        // Specific to type: "extraction"
        extractionFn?: ExtractionFn;

        // Specific to type: "expression"
        expression?: string;

        // Specific to type: "not"
        field?: Filter;

        // Specific to type: "and" | "or"
        fields?: Filter[];
    }

    // http://druid.io/docs/latest/Aggregations.html
    export type AggregationType = 'count' | 'longSum' | 'doubleSum' | 'doubleMin' | 'doubleMax' | 'longMin' | 'longMax'
  | 'doubleFirst' | 'doubleLast' | 'longFirst' | 'longLast' | 'cardinality' | 'hyperUnique' | 'thetaSketch'
  | 'filtered' | 'javascript';
 
    interface Aggregation {
        type: AggregationType;
        name?: string;
        fieldName?: string;
        expression?: string;

        // Specific to type: "javascript" and "cardinality"
        fieldNames?: string[];
        fields?: DimensionSpec[];

        // Specific to type: "javascript"
        fnAggregate?: string;
        fnCombine?: string;
        fnReset?: string;

        // Specific to type: "filtered"
        filter?: Filter;
        aggregator?: Aggregation;

        // Specific to type: "cardinality"
        byRow?: boolean;
        round?: boolean;

        // Specific to type: "approxHistogramFold"
        resolution?: number;
        numBuckets?: number;
        lowerLimit?: number;
        upperLimit?: number;

        // Specific to type: "thetaSketch"
        isInputThetaSketch?: boolean;
        size?: number;

        // Specific to type: "quantilesDoublesSketch"
        k?: number;
    }

    // http://druid.io/docs/latest/Post-aggregations.html
    interface PostAggregation {
        type: string;
        name?: string;
        ordering?: string;

        // Specific to type: "expression"
        expression?: string;

        // Specific to type: "arithmetic"
        fn?: string;
        fields?: PostAggregation[];

        // Specific to type: "fieldAccess"
        fieldName?: string;

        // Specific to type: "constant"
        value?: number;

        // Specific to type: "javascript"
        fieldNames?: string[];
        "function"?: string;

        // Specific to type: "equalBuckets"
        numBuckets?: number;

        // Specific to type: "buckets"
        bucketSize?: number;
        offset?: number;

        // Specific to type: "quantile"
        probability?: number;

        // Specific to type: "quantiles"
        probabilities?: number[];

        // Specific to type: "thetaSketchEstimate"
        field?: PostAggregation;

        // Specific to type: "thetaSketchSetOp"
        func?: 'UNION' | 'INTERSECT' | 'NOT';
        size?: number;

        // Specific to type: "quantilesDoublesSketchToQuantile"
        fraction?: number;
    }

    // http://druid.io/docs/latest/Granularities.html
    type Granularity = string | GranularityFull;
    interface GranularityFull {
        type: string;
        duration?: number; // or string?

        period?: string;
        timeZone?: string;
        origin?: string;
    }

    // http://druid.io/docs/latest/LimitSpec.html
    type OrderByColumnSpec = string | OrderByColumnSpecFull;
    interface OrderByColumnSpecFull {
        dimension: string;
        direction?: string;
        dimensionOrder?: string;
    }
    interface LimitSpec {
        type: string;
        limit?: number;
        columns?: OrderByColumnSpec[];
    }

    // http://druid.io/docs/latest/Having.html
    interface Having {
        type: string;
        aggregation?: string;
        value?: number;

        // Specific to type: "not"
        havingSpec?: Having;

        // Specific to type: "and" | "or"
        havingSpecs?: Having[];

        // Specific to type: "filter"
        filter?: Filter;
    }

    // http://druid.io/docs/latest/SearchQuerySpec.html
    interface SearchQuerySpec {
        type: string;

        // Specific to type: "contains"
        value?: string;
        caseSensitive?: boolean;

        // Specific to type: "fragment"
        values?: string[];
    }

    // http://druid.io/docs/latest/SegmentMetadataQuery.html
    interface ToInclude {
        type: string;

        // Specific to type: "list"
        columns?: string[];
    }

    // http://druid.io/docs/latest/DimensionSpecs.html
    interface ExtractionLookup {
        type: string;

        // Specific to type: "map"
        map?: { [key: string]: string };

        // Specific to type: "namespace"
        namespace?: string;
    }

    // http://druid.io/docs/latest/DimensionSpecs.html
    interface ExtractionFn {
        type: string;

        // Specific to type: "regex"
        expr?: string;
        replaceMissingValue?: boolean;

        // Specific to type: "searchQuery"
        query?: string;

        // Specific to type: "time"
        timeFormat?: string;
        resultFormat?: string;

        // Specific to type: "javascript"
        "function"?: string;
        injective?: boolean;

        // Specific to type: "substring"
        index?: number;
        length?: number;

        // Specific to type: "timeFormat"
        format?: string;
        timeZone?: string;
        locale?: string;
        granularity?: Granularity;

        // Specific to type: "bucket"
        size?: number;
        offset?: number;

        // Specific to type: "lookup"
        lookup?: ExtractionLookup | string; // string if type = registeredLookup
        retainMissingValue?: boolean;
        replaceMissingValueWith?: string;
        optimize?: boolean;

        // Specific to type: "cascade"
        extractionFns?: ExtractionFn[];

        // Specific to type: "listFiltered"
        delegate?: DimensionSpec;
        values?: string[];
        isWhitelist?: boolean;

        // Specific to type: "regexFiltered"
        pattern?: string;

        // Specific to type: "stringFormat"
        nullHandling?: 'nullString' | 'emptyString' | 'returnNull';
    }

    type OutputType = 'STRING' | 'LONG' | 'FLOAT' | 'DOUBLE';

    // http://druid.io/docs/latest/DimensionSpecs.html
    type DimensionSpec = string | DimensionSpecFull;
    interface DimensionSpecFull {
        type: string;
        dimension?: string;
        outputName?: string;
        outputType?: OutputType;

        // Specific to type: "extraction"
        extractionFn?: ExtractionFn;
        dimExtractionFn?: ExtractionFn; // This is deprecated

        // Specific to type: "listFiltered" | "regexFiltered"
        delegate?: DimensionSpec;
        pattern?: string;
        values?: string[];
        isWhitelist?: boolean;
    }

    interface VirtualColumn {
        type: string;
        name: string;
        expression: string;
        outputType: OutputType;
    }

    // http://druid.io/docs/latest/TopNMetricSpec.html
    type TopNMetricSpec = string | TopNMetricSpecFull;
    interface TopNMetricSpecFull {
        type: string;

        // Specific to type: "inverted"
        metric?: TopNMetricSpec;

        // Specific to type: "dimension"
        ordering?: string;

        // Specific to type: "lexicographic" | "alphaNumeric"
        previousStop?: any;
    }

    // http://druid.io/docs/latest/SelectQuery.html
    interface PagingSpec {
        pagingIdentifiers: PagingIdentifiers;
        threshold: number
        fromNext?: boolean;
    }

    // http://druid.io/docs/latest/DataSource.html
    type DataSource = string | DataSourceFull;
    interface DataSourceFull {
        type: string;

        // Specific to type: "table"
        name?: string;

        // Specific to type: "union"
        dataSources?: string[];

        // Specific to type: "query"
        query?: Query;
    }

    // http://druid.io/docs/latest/Querying.html
    interface Query {
        queryType: string;
        dataSource: DataSource;
        context?: Context;
        intervals?: Intervals;
        filter?: Filter;
        aggregations?: Aggregation[];
        postAggregations?: PostAggregation[];
        granularity?: Granularity;

        virtualColumns?: VirtualColumn[];

        // Used by queryType: "groupBy" and "select";
        dimensions?: DimensionSpec[];

        // Specific to queryType: "groupBy"
        // http://druid.io/docs/latest/GroupByQuery.html
        limitSpec?: LimitSpec;
        having?: Having;

        // Specific to queryType: "search"
        // http://druid.io/docs/latest/SearchQuery.html
        searchDimensions?: string[];
        query?: SearchQuerySpec;
        sort?: string; // ToDo: revisit after clarification
        lenientAggregatorMerge?: boolean;

        // Specific to queryType: "segmentMetadata"
        // http://druid.io/docs/latest/SegmentMetadataQuery.html
        toInclude?: ToInclude;
        merge?: boolean;
        analysisTypes?: string[];

        // Specific to queryType: "timeBoundary"
        // http://druid.io/docs/latest/TimeBoundaryQuery.html
        bound?: string;

        // Specific to queryType: "timeseries"
        // http://druid.io/docs/latest/TimeseriesQuery.html
        // <nothing>

        // Specific to queryType: "topN"
        // http://druid.io/docs/latest/TopNQuery.html
        dimension?: DimensionSpec;
        threshold?: number;
        metric?: TopNMetricSpec;

        // Specific to queryType: "select"
        // http://druid.io/docs/latest/SelectQuery.html
        metrics?: string[];
        pagingSpec?: PagingSpec;
        descending?: boolean;

        // Specific to queryType: "scan"
        // http://druid.io/docs/latest/querying/scan-query.html
        resultFormat?: 'list' | 'compactedList';
        columns?: string[];
        batchSize?: number;
        limit?: number;
        legacy?: boolean;
    }

    /* ----------------------- *\
    |          Results          |
    \* ----------------------- */

    // The result of calling http://$host:$port/druid/v2/datasources
    type OverallIntrospectResult = string[];

    // The result of calling http://$host:$port/druid/v2/datasources/$datasource
    interface DatasourceIntrospectResult {
        dimensions: string[];
        metrics: string[];
    }

    // http://druid.io/docs/latest/TimeBoundaryQuery.html
    interface TimeBoundaryDatum {
        timestamp: string;
        result: string | Result; // string in case of useDataSourceMetadata
    }

    type TimeBoundaryResults = TimeBoundaryDatum[];

    // http://druid.io/docs/latest/TopNQuery.html
    // http://druid.io/docs/latest/SearchQuery.html
    interface Result {
        [field: string]: string | number;
    }

    interface DruidDatum {
        timestamp: string;
        result: Result[];
    }

    type DruidResults = DruidDatum[];

    // http://druid.io/docs/latest/TimeseriesQuery.html
    interface TimeseriesDatum {
        timestamp: string;
        result: Result;
    }

    type TimeseriesResults = TimeseriesDatum[];

    // http://druid.io/docs/latest/GroupByQuery.html
    interface GroupByDatum {
        version: string;
        timestamp: string;
        event: Result;
    }

    type GroupByResults = GroupByDatum[];

    // http://druid.io/docs/latest/SegmentMetadataQuery.html
    interface ColumnMetadata {
        type: string;
        size?: number;
        cardinality?: number;
        minValue?: number | string;
        maxValue?: number | string;
        hasMultipleValues?: boolean;
        errorMessage?: string;
    }

    interface SegmentMetadataDatum {
        id: string;
        intervals: Intervals;
        size: number;
        numRows?: number;
        columns: { [columnName: string]: ColumnMetadata };
        aggregators?: { [columnName: string]: Aggregation };
    }

    type SegmentMetadataResults = SegmentMetadataDatum[];

    // http://druid.io/docs/latest/SelectQuery.html
    interface Event {
        segmentId: string;
        offset: number;
        event: Result;
    }

    interface PagingIdentifiers {
        [segment: string]: number;
    }

    interface SelectResult {
        pagingIdentifiers: PagingIdentifiers;
        events: Event[];
    }

    interface SelectDatum {
        timestamp: string;
        result: SelectResult;
    }

    type SelectResults = SelectDatum[];


    interface StatusModule {
        name: string;
        artifact?: string;
        version?: string;
    }
    interface StatusResult {
        version: string;
        modules: StatusModule[],
        memory: {
            maxMemory: number;
            totalMemory: number;
            freeMemory: number;
            usedMemory: number;
        };
    }

}

declare module "druid.d.ts" {
    export = Druid;
}
