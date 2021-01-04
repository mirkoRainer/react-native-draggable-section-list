import React, { ReactNode } from "react";
import DraggableFlatList, { DraggableFlatListProps, RenderItemParams } from "react-native-draggable-flatlist";


/**
 * The label for a Section with the Filter function to determine what falls under the section. If more than one Section result in the same filter, only the first Section in the array will have the <T> under it.
 *
 * @param label - The name to be displayed a the beginning of a section.
 * @typeParam T - Type of objects for the items
 */
export type SectionHeaderData<T> = {
    label: string;
    sectionFilter: (item: T) => boolean;
    collapsible: boolean;
};

type Modify<T, R> = Omit<T, keyof R> & R;
/**
 * Props for the DraggableSectionList
 *
 * @typeParam T - The item type listed under the sections
 * @param sections - SectionHeaderData<T>
 * @param renderItem - The render component for items
 * @param renderSectionHeader - The render component for SectionHeaders
 * @param keyExtractor - Used to extract a unique key for a given item at the specified index. Key is used for caching and as the react key to track item re-ordering. The default extractor checks item.key, then falls back to using the index, like React does.
 * @param sectionHeaderKeyExtractor - For Sections: Used to extract a unique key for a given item at the specified index. Key is used for caching and as the react key to track item re-ordering. The default extractor checks item.key, then falls back to using the index, like React does.
 */
type Props<T> = Modify<
    DraggableFlatListProps<T | string>,
    {
        items: T[];
        sections: SectionHeaderData<T>[];
        renderItem: (params: RenderItemParams<T>) => ReactNode;
        renderSectionHeader: (params: RenderItemParams<string>) => ReactNode;
        keyExtractor: (item: T, index: number) => string;
        sectionHeaderKeyExtractor: (
            sectionHeader: string,
            index: number
        ) => string;
    }
>;

type State = {};

class DraggableSectionList<T> extends React.Component<Props<T>, State> {
    items = this.props.items;
    renderItem: (params: RenderItemParams<T | string>) => ReactNode = (
        params
    ) => {
        if (typeof params.item === "string") {
            return this.props.renderSectionHeader(
                params as RenderItemParams<string>
            );
        }
        return this.props.renderItem(params as RenderItemParams<T>);
    };
    keyExtractor: (item: T | string, index: number) => string = (
        item,
        index
    ) => {
        if (typeof item === "string") {
            return this.props.sectionHeaderKeyExtractor(item as string, index);
        }
        return this.props.keyExtractor(item as T, index);
    };

    render() {
        const {
            renderSectionHeader,
            renderItem,
            keyExtractor,
            sectionHeaderKeyExtractor,
            data,
            items,
            sections,
            getItemLayout,
            ...flatListProps
        } = this.props;
        return (
            <DraggableFlatList<T | string>
                data={this.items}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                {...flatListProps}
            />
        );
    }
}

export default DraggableSectionList;
